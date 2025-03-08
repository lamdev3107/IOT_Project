import User from "../models/user.model";

const login = async (req, res, next) => {
  try {
    const payload = req.body;

    const user = await User.findOne({
      where: { email: payload?.email },
      raw: true,
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, mesage: "Invalid email or password" });
    }
    const isPasswordValid = user?.password == payload.password;
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, mesage: "Invalid email or password" });
    }
    const { password, ...returnedUser } = user;

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: returnedUser });
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, { raw: true });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await User.update(req.body, { where: { id } });
    const updatedUser = await User.findByPk(id, { raw: true });
    const { password, ...returnUser } = updatedUser;
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: returnUser,
    });
  } catch (err) {
    next(err);
  }
};
export { login, updateUserProfile };
