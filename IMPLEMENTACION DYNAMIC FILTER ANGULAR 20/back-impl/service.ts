import User, { IUser } from './model';
// import { filterFactory } from '../../services/filter/filter-impl';


// const userFilter = filterFactory.createWithModel(User);

/**
 * !eliminar
 */
// const getQuery = (user: Partial<IUser>) => {
//   const { name, email, role, phone } = user;
//   let query: any = { $or: [] };

//   if (name) {
//     query.$or.push({ name });
//   }

//   if (email) {
//     query.$or.push({ email });
//   }

//   if (role) {
//     query.$or.push({ role });
//   }

//   if (phone) {
//     query.$or.push({ phone });
//   }

//   return query;
// };

// event: FilterEvent = {}
export const getUserCount = (): Promise<number> => {
  // userFilter.getQuery()
  return User.countDocuments();
};

export const getAllUsers = (user: Partial<IUser>): Promise<IUser[]> => {
  // getQuery(user)
  return User.find().select('-password');
};

export const getUserById = (id: string): Promise<IUser | null> => {
  return User.findById(id).select('-password').exec();
};

export const getOneUser = (user: Partial<IUser>) => {
  // getQuery(user)
  return User.findOne().select('-password').exec();
};

export const createUser = (user: IUser): Promise<IUser> => {
  return User.create(user).then((newUser) => {
    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;
  });
};

export const updateUser = (id: string, user: Partial<IUser>): Promise<IUser | null> => {
  delete user.password;
  return User.findByIdAndUpdate(id, { $set: user }, { new: true }).select('-password').exec();
};

export const removeUser = (id: string) => {
  return User.findByIdAndDelete(id).select('-password');
};

export const updatePassword = (id: string, password: string): Promise<IUser | null> => {
  return User.findById(id).then((user) => {
    if (!user) {
      return null;
    }

    return user.set({ password }).save();
  });
};
