import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    /**
     * Check if User is a provider
     */
    const chechIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!chechIsProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.param.id);
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
