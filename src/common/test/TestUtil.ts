import { User } from '../../users/entities/user.entity';
import { Tool } from '../../tools/entities/tool.entity';

export default class TestUtil {
  static getValidTool(): Tool {
    const tool = new Tool();
    Object.assign(tool, {
      title: 'Title Example',
      link: 'http://example.com',
      description: 'Description Example',
    });
    return tool;
  }

  static getValidUser(): User {
    const user = new User();
    Object.assign(user, {
      username: 'Username Example',
      email: 'email@example.com',
      password: 'password123',
    });

    return user;
  }
}
