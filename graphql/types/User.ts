import { enumType, extendType, nonNull, objectType, stringArg } from "nexus";
import { Link } from "./Link";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("email");
    t.string("image");
    t.field("role", { type: Role });
    t.list.field("bookmarks", {
      type: Link,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .bookmarks();
      },
    });
  },
});

const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN"],
});

export const UserMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUser", {
      type: "User",
      args: {
        name: nonNull(stringArg()),
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const newUser = {
          name: args.name,
          username: args.username,
          email: args.email,
        };
        return await ctx.prisma.user.create({ data: newUser });
      },
	});

    t.nonNull.list.field("findUser", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        console.log(args);
        return await ctx.prisma.user.findMany({
          where: {
            email: args.email,
          },
        });
      },
    });
  },
});

export const DeleteUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteUser", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        console.log(args.id);
        return await ctx.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
