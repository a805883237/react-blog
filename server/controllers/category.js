const { sequelize } = require('../models')
const { article: ArticleModel, category: CategoryModel } = require('../models')

module.exports = {

    /**
     * @api {get} /categories/getList 获取分类列表
     * @apiName getAllCategories
     * @apiDescription 获取分类列表，含文章数量统计
     * @apiGroup category
     *
     * @apiSuccess {String} code 查询状态.
     * @apiSuccess {Object[]} data  返回数量列表
     * @apiSuccess {String} data.name  标签名称
     * @apiSuccess {Number} data.count  该标签下的文章数量
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {"code":200,"data":[{"name":"js","count":1},{"name":"服务器","count":1}]}
     */
  async getCategories(ctx) {
    const data = await CategoryModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name'
    })
    ctx.body = { code: 200, data }
  },

    /**
     * @api {get} /tags/getArticles 通过category分类名称查询文章列表
     * @apiName getArticlesByCategory
     * @apiDescription 通过category分类名称 查询文章列表
     * @apiGroup article
     *
     * @apiParam {String} name 分类名称
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
     *    {"code":200,"count":1,"rows":[{"createdAt":"2019-08-05 07:23:38","updatedAt":"2019-09-01 23:08:24","id":6,"title":"服务器上传本地文件","categories":[{"name":"服务器"}]}]}
     */
  async getArticlesByCate(ctx) {
    let { page = 1, pageSize = 15, name } = ctx.query,
      offset = (page - 1) * pageSize
    pageSize = parseInt(pageSize)

    const data = await ArticleModel.findAndCountAll({
      attributes: ['id', 'title', 'createdAt'],
      include: [{ model: CategoryModel, attributes: ['name'], where: { name } }],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      distinct: true
    })
    ctx.body = { code: 200, ...data }
  }
}
