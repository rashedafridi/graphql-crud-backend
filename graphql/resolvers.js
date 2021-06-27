const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");
const Student = require("../models/students ");
const Subject = require("../models/subject");
const { deleteImage } = require("../utils/file");

module.exports = {
  createStudent: async function ({ studentInput }, req) {
    //   const email = args.userInput.email;
    const errors = [];
    if (!validator.isEmail(studentInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (!validator.isMobilePhone(studentInput.phone)) {
      errors.push({ message: "phone is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingStudent = await Student.findOne({
      email: studentInput.email,
    });
    if (existingStudent) {
      const error = new Error("Students exists already!");
      throw error;
    }

    const student = new Student({
      email: studentInput.email,
      name: studentInput.name,
      phone: studentInput.phone,
      dateOfBirth: studentInput.dateOfBirth,
      subject: studentInput.subject,
    });
    const studentsCreated = await student.save();
    return { ...studentsCreated._doc, _id: studentsCreated._id.toString() };
  },
  getStudents: async function ({ page }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    if (!page) {
      page = 1;
    }
    const perPage = 5;
    const totalStudents = await Student.find().countDocuments();
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("Subject");
    return {
      students: students.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
      totalStudents: totalStudents,
    };
  },
  getSingleStudent: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const student = await Student.findById(id).populate("Subject");
    if (!student) {
      const error = new Error("No student found!");
      error.code = 404;
      throw error;
    }
    return {
      ...student._doc,
      _id: student._id.toString(),
    };
  },
  updateStudent: async function ({ id, studentInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const student = await Student.findById(id).populate("Subject");
    if (!student) {
      const error = new Error("No student found!");
      error.code = 404;
      throw error;
    }
    const errors = [];
    if (!validator.isEmail(studentInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (!validator.isMobilePhone(studentInput.phone)) {
      errors.push({ message: "phone is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    student.email = studentInput.email;
    student.name = studentInput.name;
    student.phone = studentInput.phone;
    student.dateOfBirth = studentInput.dateOfBirth;
    student.subject = studentInput.subject;
    const updatedstudent = await student.save();
    return {
      ...updatedstudent._doc,
      _id: updatedstudent._id.toString(),
    };
  },
  deleteStudent: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const student = await Student.findById(id);
    if (!student) {
      const error = new Error("No student found!");
      error.code = 404;
      throw error;
    }
    // deleteImage(student.imageUrl);
    await Student.findByIdAndRemove(id);
    // const user = await User.findById(req.userId);
    // user.students.pull(id);
    // await user.save();
    return true;
  },

  getSubject: async function ({ page }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    if (!page) {
      page = 1;
    }
    const perPage = 5;
    const totalSubjects = await Subject.find().countDocuments();
    const subjects = await Subject.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("students");
      console.log(subjects)
    return {
      Subjects: subjects.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
      totalSubjects: totalSubjects,
    };
  },
  createSubject: async function ({ SubjectInput }, req) {
    //   const email = args.userInput.email;
    const existingSubject = await Subject.findOne({ name: SubjectInput.name });
    if (existingSubject) {
      const error = new Error("Subject exists already!");
      throw error;
    }

    const subject = new Subject({
      name: SubjectInput.name,
      students: SubjectInput.studentId,
    });
    const subjectCreated = await subject.save();
    return { ...subjectCreated._doc, _id: subjectCreated._id.toString() };
  },
  getSingleSubject: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const subject = await Subject.findById(id).populate("Student");
    if (!subject) {
      const error = new Error("No Subject found!");
      error.code = 404;
      throw error;
    }
    return {
      ...subject._doc,
      _id: subject._id.toString(),
    };
  },
  updateSubject: async function ({ id, SubjectInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const subject = await Subject.findById(id);
    if (!subject) {
      const error = new Error("Subject douse not exist!");
      throw error;
    }
    subject.name = SubjectInput.name;
    subject.student = SubjectInput.student;
    const updatedsubject = await subject.save();
    return {
      ...updatedsubject._doc,
      _id: updatedsubject._id.toString(),
    };
  },
  deleteSubject: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    console.log(id)
    const subject = await Subject.findById(id);
    if (!subject) {
      const error = new Error("No subject found!");
      error.code = 404;
      throw error;
    }
    // deleteImage(subject.imageUrl);
    await Subject.findOneAndDelete(id);
    // const user = await User.findById(req.userId);
    // user.subjects.pull(id);
    // await user.save();
    return true;
  },

  createUser: async function ({ userInput }, req) {
    //   const email = args.userInput.email;
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const user = await User.findById(req.userId);
    // if (!user) {
    //   const error = new Error('Invalid user.');
    //   error.code = 401;
    //   throw error;
    // }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      //creator: user
    });
    const createdPost = await post.save();
    //user.posts.push(createdPost);
    //await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function ({ page }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    if (!page) {
      page = 1;
    }
    const perPage = 5;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");
    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
  post: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  updatePost: async function ({ id, postInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.code = 403;
      throw error;
    }
    deleteImage(post.imageUrl);
    await Post.findByIdAndRemove(id);
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },
  user: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  updateStatus: async function ({ status }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
  },
};
