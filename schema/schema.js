const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLID
} = graphql;

const books = [
  { id: '1', name: 'Book 1', genre: 'Sci-Fi', authorId: '1' },
  { id: '2', name: 'Book 2', genre: 'Sci-Fi', authorId: '2' },
  { id: '3', name: 'Book 3', genre: 'Sci-Fi', authorId: '3' }
];

const authors = [
  { id: '1', name: 'Author 1', age: 32 },
  { id: '2', name: 'Author 2', age: 54 },
  { id: '3', name: 'Author 3', age: 45 }
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id })
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuertType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});