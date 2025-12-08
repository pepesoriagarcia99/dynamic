import { Router } from 'express';

import { token } from '../../services/passport';
import { IUser, Role } from './model';
import { body } from '../../services/ajv';
import { newUserValidate, updatePasswordUserValidate, updateUserValidate } from './schema';
import { createUser, getAllUsers, getUserById, getUserCount, removeUser, updatePassword, updateUser } from './service';
import { notFound, serverError, success, unauthorized } from '../../services/response';
// import { dynamicFilter } from '../../services/dynamicFilter-library/middleware/dynamicFilter';


const router = Router();

// dynamicFilter()
router.get('/count', token({ roles: [Role.Admin] }), (req, res) => {
  // req.filterEvent
  return getUserCount().then(success(res, 200)).catch(serverError(req, res));
});

router.get('/', token({ roles: [Role.Admin] }), (req, res) => {
  const { name, email, role } = req.query as { [key: string]: string };
  const filterUser: Partial<IUser> = {
    name,
    email,
    role: role as Role
  };

  return getAllUsers(filterUser).then(success(res, 200)).catch(serverError(req, res));
});

router.get('/me', token(), (req, res) => {
  const user = req.user;
  if (!user?._id) {
    return unauthorized(res);
  }

  return getUserById(user._id).then(success(res, 200)).catch(serverError(req, res));
});

router.post('/', token({ roles: [Role.Admin] }), body(newUserValidate), (req, res) => {
  return createUser(req.body as IUser)
    .then(success(res, 201))
    .catch(serverError(req, res));
});

router.put('/:id', token({ roles: [Role.Admin] }), body(updateUserValidate), (req, res) => {
  return updateUser(req.params.id, req.body as Partial<IUser>)
    .then(notFound(res))
    .then(success(res, 204))
    .catch(serverError(req, res));
});

router.put('/password/:id', token(), body(updatePasswordUserValidate), (req, res) => {
  const user = req.user;
  const targetUserId = req.params.id;

  if (!user || !targetUserId || user._id !== targetUserId || user.role !== Role.Admin) {
    return unauthorized(res);
  }

  return updatePassword(targetUserId, req.body.password)
    .then(notFound(res))
    .then(success(res, 204))
    .catch(serverError(req, res));
});

router.delete('/:id', token({ roles: [Role.Admin] }), (req, res) => {
  return removeUser(req.params.id).then(notFound(res)).then(success(res, 204)).catch(serverError(req, res));
});

export default router;
