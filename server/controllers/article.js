const Joi = require('joi')
const ArticleSchema = require('../schemas/article')

const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  sequelize
} = require('../models')

const { checkAuth } = require('../lib/token')

module.exports = {
  // 创建文章
  async create(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      const { title, content, categories, tags } = ctx.request.body
      const validator = Joi.validate(ctx.request.body, ArticleSchema.create)
      if (validator.error) {
        ctx.body = { code: 400, message: validator.error.message }
      } else {
        const tagList = tags.map(t => ({ name: t }))
        const categoryList = categories.map(c => ({ name: c }))
        const data = await ArticleModel.create(
          { title, content, tags: tagList, categories: categoryList },
          { include: [TagModel, CategoryModel] }
        )
        ctx.body = { code: 200, message: '成功创建文章', data }
      }
    }
  },

  // 修改文章
  async update(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      const { articleId, title, content, categories, tags, showOrder } = ctx.request.body

      if (showOrder !== undefined) {
        // 文章设置置顶
        await ArticleModel.update({ showOrder }, { where: { id: articleId } })
        ctx.body = { code: 200, message: '文章置顶设置成功' }
      } else {
        const validator = Joi.validate(ctx.request.body, ArticleSchema.update)
        if (validator.error) {
          ctx.body = { code: 400, message: validator.error.message }
        } else {
          const tagList = tags.map(tag => ({ name: tag, articleId }))
          const categoryList = categories.map(cate => ({ name: cate, articleId }))
          await ArticleModel.update({ title, content }, { where: { id: articleId } })
          await TagModel.destroy({ where: { articleId } })
          await TagModel.bulkCreate(tagList)
          await CategoryModel.destroy({ where: { articleId } })
          await CategoryModel.bulkCreate(categoryList)

          ctx.body = { code: 200, message: '文章修改成功' }
        }
      }
    }
  },


    /**
     * @api {get} /article/get/:id 获取文章详情
     * @apiName GetArticle
     * @apiDescription 获取文章详情
     * @apiGroup article
     *
     * @apiParam {Number} id 文章id
     *
     * @apiSuccess {String} code 查询状态.
     * @apiSuccess {Object} data  返回文章数据
     * @apiSuccess {Number} data.id  文章ID
     * @apiSuccess {String} data.title  文章标题
     * @apiSuccess {String} data.content  文章内容
     * @apiSuccess {Object[]} data.categories  所属分类
     * @apiSuccess {String} data.categories.name  分类名称
     * @apiSuccess {Object[]} data.tags  所属标签
     * @apiSuccess {String} data.tags.name  标签名称
     * @apiSuccess {String} data.createdAt  创建时间
     * @apiSuccess {String} data.updatedAt  更新时间
     * @apiSuccess {Object[]} data.comments  文章评论
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {"code":200,"data":{"createdAt":"2019-08-05 07:23:38","updatedAt":"2019-08-05 07:23:38","id":6,"title":"服务器上传本地文件","content":"### scp 上传 web 文件\n[参考](https://blog.csdn.net/resilient/article/details/85334594)\n```\nscp -r ./build/* root@39.106.192.160:/var/www/public/web\n```","showOrder":null,"tags":[{"name":"upload"}],"categories":[{"name":"服务器"}],"comments":[]}}
     */
  async getArticleById(ctx) {
    const id = ctx.params.id
    const data = await ArticleModel.findOne({
      where: { id },
      include: [
        { model: TagModel, attributes: ['name'] },
        { model: CategoryModel, attributes: ['name'] },
        {
          model: CommentModel,
          attributes: ['id', 'userId', 'content', 'createdAt'],
          include: [
            {
              model: ReplyModel,
              attributes: ['id', 'userId', 'content', 'createdAt'],
              include: [{ model: UserModel, as: 'user', attributes: ['username'] }]
            },
            { model: UserModel, as: 'user', attributes: ['username'] }
          ]
        }
      ],
      order: [[CommentModel, 'createdAt', 'DESC']],
      row: true
    })

    ctx.body = { code: 200, data }
  },


    /**
     * @api {get} /article/getList 文章列表
     * @apiName getList
     * @apiDescription 查询文章列表
     * @apiGroup article
     *
     * @apiParam {String} title 文章名称
     * @apiParam {String} tag 标签查找
     * @apiParam {String} category 分类查找
     * @apiParam {Boolean} fetchTop 创建时间
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

  /** 查询文章列表
   * @param {Number} offset - 当前页码 默认1
   * @param {Number} limit - 限制查询数量 默认 10
   * ...
   */
  async getArticleList(ctx) {
    let { page = 1, pageSize = 10, title, tag, category, rangTime, fetchTop } = ctx.query,
      offset = (page - 1) * pageSize,
      queryParams = {},
      order = [['createdAt', 'DESC']];

    if (title) queryParams.title = { $like: `%${title}%` }
    if (fetchTop === 'true') {
      queryParams.showOrder = 1
      order = [['updatedAt', 'DESC']]
    }

    const tagFilter = tag ? { name: tag } : {}
    const categoryFilter = category ? { name: category } : {}

    pageSize = parseInt(pageSize) // 处理 pageSize

    const data = await ArticleModel.findAndCountAll({
      where: queryParams,
      include: [
        { model: TagModel, attributes: ['name'], where: tagFilter },
        { model: CategoryModel, attributes: ['name'], where: categoryFilter },
        {
          model: CommentModel,
          attributes: ['id'],
          include: [{ model: ReplyModel, attributes: ['id'] }]
        }
      ],
      offset,
      limit: pageSize,
      order,
      row: true,
      distinct: true
    });

    ctx.body = { code: 200, ...data }
  },

  // 删除文章
  async delete(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      const { articleId } = ctx.query
      if (articleId) {
        if (articleId !== -1) {
          await TagModel.destroy({ where: { articleId } })
          await ArticleModel.destroy({ where: { id: articleId } })
          await sequelize.query(
            // `
            //   delete article, tag, category, comment, reply from article
            //   inner join tag on article.id=tag.articleId
            //   inner join category on article.id=category.articleId
            //   inner join comment on article.id=comment.articleId
            //   inner join reply on comment.id=reply.commentId
            //   where article.id=${articleId}
            // `
            `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.articleId=${articleId}`
          )
          ctx.body = { code: 200, message: '成功删除文章' }
        } else {
          ctx.body = { code: 403, message: '禁止删除！ 此文章用于关于页面的留言。' }
        }
      } else {
        ctx.body = { code: 403, message: '文章 id 不能为空' }
      }
    }
  }
}
