import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { extendType, makeSchema, mutationType, nullable, objectType, queryType, stringArg , nonNull } from 'nexus'
import * as path from 'path'
import { User, Post } from 'nexus-prisma'

const prisma = new PrismaClient()

const apollo = new ApolloServer({
  context: () => ({ prisma }),
  cors: true,
  csrfPrevention: false,
  schema: makeSchema({
    sourceTypes: {
      modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
    },
    contextType: {
      module: path.join(__dirname, 'context.ts'),
      export: 'Context',
    },
    outputs: {
      typegen: path.join(
        __dirname,
        'node_modules/@types/nexus-typegen/index.d.ts',
      ),
      schema: path.join(__dirname, './api.graphql'),
    },
    shouldExitAfterGenerateArtifacts: Boolean(
      process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION,
    ),
    types: [
      objectType({
        name: User.$name,
        description: User.$description,
        definition(t) {
          t.field(User.id)
          t.field(User.name)
          t.field(User.email)
        }
      }),
      objectType({
        name: Post.$name,
        description: Post.$description,
        definition(t){
          t.field(Post.id),
          t.field(Post.content),
          t.field(Post.userId)
        }
      }),
      objectType({
        name:  'Query',
        definition(t){
          t.list.field('users', {
            type:"User",
            resolve(_root, _args, ctx) {
            return ctx.prisma.user.findMany()
            },
          })
        }
      }),
      extendType({
        type:  'Query',
        definition(t){
          t.list.field('posts', {
            type:"Post",
            resolve(_root, _args, ctx) {
              return ctx.prisma.post.findMany()
            },
          })
        }
      }),
      objectType({
        name: 'Mutation',
        definition(t) {
          t.field('createUser', {
            type: 'User',
            args: {
              name: nonNull(stringArg()),
              email: nonNull(stringArg())
            },
            resolve(_root, _args, ctx) {
              const newUser = 
              {
                name: _args.name,
                email: _args.email
              }
              const returnedUser = ctx.prisma.user.create({
                 data: newUser
              })
             return returnedUser
            },
          })
        }
      }),
      extendType({
        type: 'Mutation',
        definition(t) {
          t.field('createPost', {
            type: 'Post',
            args: {
              content: nonNull(stringArg()),
              userId: nonNull(stringArg())
            },
            resolve(_root, _args, ctx) {
              const newPost = 
              {
                content: _args.content,
                userId: _args.userId
              }
              const returnedPost = ctx.prisma.post.create({
                 data: newPost
              })
             return returnedPost
            },
          })
        }
      }),

    ],
  }),
})

apollo.listen().then(() => {
  console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`)
})