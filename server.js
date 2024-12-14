const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { runWithParams } = require('./backend');
const multer = require('multer');
const fs = require('fs');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const crypto = require('crypto');

// Setup storage for image upload on /run
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './');  // Save in current directory
  },
  filename: (req, file, cb) => {
    cb(null, 'new-moon-face.png');  // Always save as new-moon-face.png
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png') {
      return cb(new Error('Only PNG files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- New code: replicate wallet creation logic here for the first step ---
function createWallet(type, id = null) {
  const wallet = Keypair.generate();
  const walletData = {
    id: id || type,
    publicKey: wallet.publicKey.toBase58(),
    privateKey: bs58.encode(wallet.secretKey)
  };
  return { wallet, walletData };
}

const activeWalletSessions = new Map();

app.post('/createWallets', (req, res) => {
  try {
    const numTraders = parseInt(req.body.numTraders);
    if (isNaN(numTraders) || numTraders < 5 || numTraders > 25) {
      return res.status(400).send('Number of trader wallets must be between 5 and 25');
    }

    // Generate session ID
    const sessionId = crypto.randomBytes(16).toString('hex');

    // Create wallets as before...
    const { wallet: devWallet, walletData: devWalletData } = createWallet('dev_wallet');
    const { wallet: airdropWallet, walletData: airdropWalletData } = createWallet('airdrop_wallet');

    // Create trader wallets
    const traderWallets = [];
    const traderWalletsData = [];
    for (let i = 0; i < numTraders; i++) {
      const { wallet, walletData } = createWallet(null, `trader_${i}`);
      traderWallets.push(wallet);
      traderWalletsData.push(walletData);
    }

    // Store wallet data in memory with session ID
    activeWalletSessions.set(sessionId, {
      devWallet: devWalletData,
      airdropWallet: airdropWalletData,
      traderWallets: traderWalletsData
    });

    // Return JSON with all wallets and session ID
    res.json({
      sessionId,
      devWallet: devWalletData,
      airdropWallet: airdropWalletData,
      traderWallets: traderWalletsData
    });

  } catch (error) {
    console.error("Error creating wallets:", error);
    res.status(500).send("Error creating wallets: " + error.message);
  }
});

// Serve the initial page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Run the full script after user has funded the wallets and chosen token details
app.post('/run', upload.single('tokenImage'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Token image is required');
    }

    const sessionId = req.body.sessionId;
    const walletData = activeWalletSessions.get(sessionId);
    
    if (!walletData) {
      throw new Error('No wallet data found. Please create wallets first.');
    }

    const params = {
      numTraders: req.body.numTraders,
      fundingAmount: req.body.fundingAmount,
      tokenName: req.body.tokenName,
      tokenSymbol: req.body.tokenSymbol,
      tokenDescription: req.body.tokenDescription,
      tokenTwitter: req.body.tokenTwitter,
      tokenTelegram: req.body.tokenTelegram,
      tokenWebsite: req.body.tokenWebsite,
      createAmount: req.body.createAmount,
      createSlippage: req.body.createSlippage,
      createPriorityFee: req.body.createPriorityFee,
      buyAmount: req.body.buyAmount,
      buySlippage: req.body.buySlippage,
      buyPriorityFee: req.body.buyPriorityFee,
      walletData: walletData // Pass the stored wallet data
    };

    console.log("Received parameters for run:", params);

    await runWithParams(params);
    
    // Clean up the session data after successful run
    activeWalletSessions.delete(sessionId);
    
    res.send("Script executed successfully! Check console logs for details.");
  } catch (error) {
    console.error(error);
    if (fs.existsSync('./new-moon-face.png')) {
      fs.unlinkSync('./new-moon-face.png');
    }
    res.status(500).send("Error running script: " + error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
