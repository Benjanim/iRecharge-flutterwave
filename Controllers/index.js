const FLW_PUBLIC_KEY = 'FLWPUBK_TEST-32193bba8dab84e3d9c4525c85ea7a12-X';
const FLW_SECRET_KEY = "FLWSEC_TEST-32193bba8dab84e3d9c4525c85ea7a12-X"
const FLW_ENCRYPTION_KEY = "32193bba8dab84e3d9c4525c85ea7a12";

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);

module.exports = {
  ChargeCard: async (req, res) => {
    
    try {
      const payload = {
        card_number: req.body.card_number,
        cvv: req.body.card_cvv,
        expiry_month: req.body.card_expiry_year,
        expiry_year: req.body.card_expiry_year,
        currency: 'NGN',
        amount: product.price,
        email: req.user.email,
        fullname: req.body.card_name,
        tx_ref: generateRandomString(10),
        // redirect_url: '/pay/redirect',
        enckey: FLW_ENCRYPTION_KEY
      }
  
      const response = await flw.Charge.card(payload);
  
      if(response.status == true) {
        
        const transactionId = response.data.id;
        const transaction = await flw.Transaction.verify({ id: transactionId });
        
        if (transaction.data.status == "successful") {
          return res.status(200).json({ 
            status: true,
            message: "charge successful",
            data: transaction.data
          });
        } 
        else if (transaction.data.status == "pending") {
          // Schedule a job that polls for the status of the payment every 10 minutes
          return res.status(200).json({ 
            status: true,
            message: "charge processing, wait a few minutes",
            data: transaction.data
          });
        } 
        else {
          return res.status(200).json({ 
            status: false,
            message: "charge failed",
            data: transaction.data
          });
        }
      }
      else {
        return res.status(422).json({ 
          status: false,
          message: "charge failed: " + response.message,
          data: {}
        });
      } 
    }
    catch (e) {
      return res.status(422).json({ 
        status: false,
        message: "charge failed: " + e.message,
        data: {}
      });
    }
  }
};

function generateRandomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
}
