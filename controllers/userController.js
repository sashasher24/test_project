const User = require('../models/user');

class userController {
  async addUser(request, response) {
    try {
      const { name, email } = request.body;

      const user = new User({
        name,
        email
      });

      await user.save();
      return response.status(200).json({ message: 'User created successfully' });
    } catch (e) {
      response.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteUser(request, response) {
    try {
      const userProfile = await User.findOne({email: request.body.email}); // Ensure request.user is set properly
      if (!userProfile) {
        return response.status(400).json({ message: 'Bad request' });
      }

      await User.deleteOne({ email: userProfile.email });

      return response.status(200).json({ message: 'User deleted successfully' });
    } catch (e) {
      console.log(e);
      response.status(500).json({ message: 'Internal server error' });
    }
  }

  async showUsers(request, response) {
    try {
      const users = await User.find({});

      return response.status(200).json({ users });
    } catch (e) {
      response.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new userController();