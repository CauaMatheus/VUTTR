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
}
