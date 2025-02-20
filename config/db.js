const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.green.bold(' \n\n✅ MongoDB Connected Successfully!'));
  } catch (error) {
    console.log(chalk.red.bold('\n\n ❌ MongoDB Connection Failed!'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

module.exports = connectDB;
