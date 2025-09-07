module.exports = async function handler(req, res) {
  console.log('Test function called');
  return res.status(200).json({ message: 'Test successful', method: req.method });
};