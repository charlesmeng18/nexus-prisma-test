"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const nexus_1 = require("nexus");
const path = __importStar(require("path"));
const nexus_prisma_1 = require("nexus-prisma");
const prisma = new client_1.PrismaClient();
const apollo = new apollo_server_1.ApolloServer({
    context: () => ({ prisma }),
    cors: true,
    csrfPrevention: false,
    schema: (0, nexus_1.makeSchema)({
        sourceTypes: {
            modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
        },
        contextType: {
            module: path.join(__dirname, 'context.ts'),
            export: 'Context',
        },
        outputs: {
            typegen: path.join(__dirname, 'node_modules/@types/nexus-typegen/index.d.ts'),
            schema: path.join(__dirname, './api.graphql'),
        },
        shouldExitAfterGenerateArtifacts: Boolean(process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION),
        types: [
            (0, nexus_1.objectType)({
                name: nexus_prisma_1.User.$name,
                description: nexus_prisma_1.User.$description,
                definition(t) {
                    t.field(nexus_prisma_1.User.id);
                    t.field(nexus_prisma_1.User.name);
                    t.field(nexus_prisma_1.User.email);
                }
            }),
            (0, nexus_1.objectType)({
                name: nexus_prisma_1.Post.$name,
                description: nexus_prisma_1.Post.$description,
                definition(t) {
                    t.field(nexus_prisma_1.Post.id),
                        t.field(nexus_prisma_1.Post.content),
                        t.field(nexus_prisma_1.Post.userId);
                }
            }),
            (0, nexus_1.objectType)({
                name: nexus_prisma_1.Comment.$name,
                description: nexus_prisma_1.Comment.$description,
                definition(t) {
                    t.field(nexus_prisma_1.Comment.id),
                        t.field(nexus_prisma_1.Comment.content),
                        t.field(nexus_prisma_1.Comment.userId);
                }
            }),
            ///  query for users
            (0, nexus_1.queryType)({
                definition(t) {
                    t.list.field('users', {
                        type: "User",
                        resolve(_root, _args, ctx) {
                            return ctx.prisma.user.findMany();
                        },
                    });
                }
            }),
            /// query for posts
            (0, nexus_1.extendType)({
                type: 'Query',
                definition(t) {
                    t.list.field('posts', {
                        type: "Post",
                        resolve(_root, _args, ctx) {
                            return ctx.prisma.post.findMany();
                        },
                    });
                }
            }),
            /// query for comments
            (0, nexus_1.extendType)({
                type: 'Query',
                definition(t) {
                    t.list.field('comments', {
                        type: "Comment",
                        resolve(_root, _args, ctx) {
                            return ctx.prisma.comment.findMany();
                        },
                    });
                }
            }),
            /// create new User
            (0, nexus_1.mutationType)({
                definition(t) {
                    t.field('createUser', {
                        type: 'User',
                        args: {
                            name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                            email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
                        },
                        resolve(_root, _args, ctx) {
                            const newUser = {
                                name: _args.name,
                                email: _args.email
                            };
                            const returnedUser = ctx.prisma.user.create({
                                data: newUser
                            });
                            return returnedUser;
                        },
                    });
                }
            }),
            /// create new Post
            (0, nexus_1.extendType)({
                type: 'Mutation',
                definition(t) {
                    t.field('createPost', {
                        type: 'Post',
                        args: {
                            content: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                            userId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
                        },
                        resolve(_root, _args, ctx) {
                            const newPost = {
                                content: _args.content,
                                userId: _args.userId
                            };
                            const returnedPost = ctx.prisma.post.create({
                                data: newPost
                            });
                            return returnedPost;
                        },
                    });
                }
            }),
            /// create new Comment
            (0, nexus_1.extendType)({
                type: 'Mutation',
                definition(t) {
                    t.field('createComment', {
                        type: 'Comment',
                        args: {
                            userId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                            postId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                            content: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                        },
                        resolve(_root, _args, ctx) {
                            const newComment = {
                                postId: _args.postId,
                                userId: _args.userId,
                                content: _args.content,
                            };
                            const returnedComment = ctx.prisma.comment.create({
                                data: newComment
                            });
                            return returnedComment;
                        },
                    });
                }
            }),
            /// updatePost
            (0, nexus_1.extendType)({
                type: 'Mutation',
                definition(t) {
                    t.field('updatePost', {
                        type: 'Post',
                        args: {
                            content: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                            id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
                        },
                        resolve(_root, _args, ctx) {
                            const newPost = {
                                content: _args.content,
                                id: _args.id
                            };
                            const returnedPost = ctx.prisma.post.update({
                                data: newPost,
                                where: {
                                    id: _args.id
                                }
                            });
                            return returnedPost;
                        },
                    });
                }
            }),
            // updateComment
            (0, nexus_1.extendType)({
                type: 'Mutation',
                definition(t) {
                    t.field('updateComment', {
                        type: 'Comment',
                        args: {
                            id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                            content: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
                        },
                        resolve(_root, _args, ctx) {
                            const newComment = {
                                id: _args.id,
                                content: _args.content
                            };
                            const returnedComment = ctx.prisma.comment.update({
                                data: newComment,
                                where: {
                                    id: _args.id
                                }
                            });
                            return returnedComment;
                        },
                    });
                }
            }),
        ],
    }),
});
apollo.listen().then(() => {
    console.log(`🚀 GraphQL service ready...`);
});
