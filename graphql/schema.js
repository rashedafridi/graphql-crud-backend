const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Student {
        _id: ID!
        email: String!
        phone: String!
        name: String!
        dateOfBirth: String!
        imageUrl: String
        subjects: [Subject!]
    }
    type Subject {
        _id: ID!
        name: String!
        students: [Student]!
    }

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }
    type StudentData {
        students: [Student!]!
        totalStudents: Int!
    }
    type SubjectData {
        Subjects: [Subject!]!
        totalSubjects: Int!
    }

    input StudentInputData {
        email: String!
        phone: String!
        name: String!
        dateOfBirth: String!
        imageUrl: String
        subjectId: [String]
    }

    input SubjectInputData {
        name: String!
        studentId: [String]
    }
    input UserInputData {
        email: String!
        name: String!
        password: String!
    }
    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery {
        getStudents(page: Int): StudentData!
        getSingleStudent(id: ID!): Student!
        getSubject(page: Int): SubjectData!
        getSingleSubject(id: ID!): Subject!
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
        post(id: ID!): Post!
        user: User!
    }

    type RootMutation {
        createStudent(studentInput: StudentInputData): Student!
        updateStudent(id: ID!, StudentInput: StudentInputData): Student!
        deleteStudent(id: ID!): Boolean
        createSubject(subjectInput: SubjectInputData): Subject!
        updateSubject(id: ID!, SubjectInput: SubjectInputData): Subject!
        deleteSubject(id: ID!): Boolean
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean
        updateStatus(status: String!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
