const { sequelize } = require('../models')
const { tag: TagModel, article: ArticleModel, category: CategoryModel } = require('../models')

module.exports = {

    /**
     * @api {get} /tags/getList 获取标签列表
     * @apiName getAllTags
     * @apiDescription 获取标签列表，含文章数量统计
     * @apiGroup tag
     *
     * @apiSuccess {String} code 查询状态.
     * @apiSuccess {Object[]} data  返回数量列表
     * @apiSuccess {String} data.name  标签名称
     * @apiSuccess {Number} data.count  该标签下的文章数量
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {"code":200,"data":[{"name":"upload","count":1},{"name":"订阅","count":1}]}
     */
  async getTags(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name'
    })
    ctx.body = { code: 200, data }
  },

  /**
   * @api {get} /tags/getArticles 通过tag标签名称查询文章列表
   * @apiName getArticles
   * @apiDescription 通过tag标签名称 查询文章列表
   * @apiGroup article
   *
   * @apiParam {String} name 标签名称
   * @apiParam {Number} pageSize 查询每页数量
   * @apiParam {Number} page 查询页码
   *
   * @apiSuccess {String} code 查询状态.
   * @apiSuccess {String} count  数量总计
   * @apiSuccess {Object[]} rows  返回数量列表
   * @apiSuccess {Number} rows.id  文章ID
   * @apiSuccess {String} rows.title  文章标题
   * @apiSuccess {String} rows.content  文章内容
   * @apiSuccess {Object[]} rows.categories  所属分类
   * @apiSuccess {String} rows.categories.name  分类名称
   * @apiSuccess {Object[]} rows.tags  所属标签
   * @apiSuccess {String} rows.tags.name  标签名称
   * @apiSuccess {String} rows.createdAt  创建时间
   * @apiSuccess {String} rows.updatedAt  更新时间
   * @apiSuccess {Object[]} rows.comments  文章评论
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "code": 200,
   *       "count": 2,
   *       "rows": [{"createdAt":"2019-08-05 07:23:38","updatedAt":"2019-08-05 07:23:38","id":6,"title":"服务器上传本地文件","content":"### scp 上传 web 文件\n[参考](https://blog.csdn.net/resilient/article/details/85334594)\n```\nscp -r ./build/* root@39.106.192.160:/var/www/public/web\n```","showOrder":null,"tags":[{"name":"upload"}],"categories":[{"name":"服务器"}],"comments":[]},{"createdAt":"2019-08-05 06:49:20","updatedAt":"2019-08-05 06:49:20","id":5,"title":"JS订阅模式","content":"121312312\n中文测试","showOrder":null,"tags":[{"name":"订阅"}],"categories":[{"name":"js"}],"comments":[{"createdAt":"2019-09-01 22:19:50","updatedAt":"2019-09-01 22:19:50","id":2,"replies":[]}]
   *     }
   */
  async getArticlesByTag(ctx) {
    let { page = 1, pageSize = 15, name } = ctx.query,
      offset = (page - 1) * pageSize

    pageSize = parseInt(pageSize)

    const data = await ArticleModel.findAndCountAll({
      attributes: ['id', 'title', 'createdAt'],
      include: [{ model: TagModel, where: { name } }, { model: CategoryModel }],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    ctx.body = { code: 200, ...data }
  }
}
