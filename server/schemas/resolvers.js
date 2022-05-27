const { AuthenticationError } = require("apollo-server-express");
const { User, Product, Category, SubCategory } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLUpload } = require("graphql-upload");
const generateRandomString = require("../utils/helpers");

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("cart")
          .populate("wishlist")
          .populate({
            path: "orders.products",
            populate: "category",
          });

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("cart")
        .populate("wishlist")
        .populate({
          path: "orders.products",
          populate: "category",
        });
    },
    products: async () => {
      return Product.find()
        .select("-__v")
        .populate("category")
        .populate("subCategory");
    },
    product: async (parent, args) => {
      return Product.findOne({ _id: args.id })
        .select("-__v")
        .populate("category")
        .populate("subCategory");
    },
    categories: async () => {
      return Category.find();
    },
    subcategories: async () => {
      return SubCategory.find();
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    updateUser: async (parent, args, context) => {
      const file = args.file;
      let newFile = "";
      if (file) {
        const { createReadStream, filename } = await file;

        const { ext } = path.parse(filename);
        const randomString = generateRandomString(10);
        const fileName = `${randomString}${ext}`;

        const stream = createReadStream();
        const pathName = path.join(__dirname, `../public/images/${fileName}`);
        await stream.pipe(fs.createWriteStream(pathName));
        newFile = fileName;
      }

      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { ...args, image_url: newFile },
          { new: true }
        );

        return user;
      }
      throw new AuthenticationError("Not logged in");
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addToCart: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }
      // if id is in cart, increment quantity
      // else add to cart
      const user = await User.findOne({ _id: context.user._id });

      if (user.cart.includes(args._id)) {
        const productIndex = user.cart.indexOf(args._id);
        user.cart[productIndex].quantity += args.quantity;
      } else {
        user.cart.push(args);
      }

      await user.save();

      return user;
    },
  },
};

module.exports = resolvers;
