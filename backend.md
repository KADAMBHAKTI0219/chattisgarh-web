const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin protected routes
router.post('/', protectAdmin, upload.single('image'), createCategory);
router.put('/:id', protectAdmin, upload.single('image'), updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;


const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;


const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/otpController');

router.post('/send', sendOtp);
router.post('/verify', verifyOtp);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createParticipant,
  getParticipants,
  getParticipantProfile,
  getParticipantById,
  updateParticipantStatus,
  deleteParticipant
} = require('../controllers/participantController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createParticipant);
router.get('/profile', getParticipantProfile);

// Admin protected routes
router.get('/', protectAdmin, getParticipants);
router.get('/:id', protectAdmin, getParticipantById);
router.put('/:id/status', protectAdmin, updateParticipantStatus);
router.delete('/:id', protectAdmin, deleteParticipant);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protectAdmin, getDashboardStats);

module.exports = router;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN'],
      default: 'ADMIN'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password before saving
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const categorySchema = new Schema(
  {
    tier: {
      type: String,
      enum: ['A_CULTURE_IDENTITY', 'B_NATION_STATE_BUILDING', 'C_CRAFT_PLATFORM'],
      required: true,
      default: 'A_CULTURE_IDENTITY'
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide category title'],
      trim: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short description']
    },
    taskBrief: {
      type: String,
      default: ''
    },
    hashtag: {
      type: String,
      default: ''
    },
    prizeTier: {
      type: String,
      enum: ['FLAGSHIP', 'MARQUEE', 'STANDARD', 'EMERGING_NANO', 'NRI'],
      required: true,
      default: 'FLAGSHIP'
    },
    cashPrizeMin: {
      type: Number,
      default: 0
    },
    cashPrizeMax: {
      type: Number,
      default: 0
    },
    submissionWindow: {
      opensAt: {
        type: Date,
        default: Date.now
      },
      closesAt: {
        type: Date,
        default: null
      }
    },
    image: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Auto-generate slug before validation if not provided
categorySchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Category', categorySchema);

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      index: true
    },
    otp: {
      type: String,
      required: [true, 'Please provide OTP']
    },
    verified: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL Index automatically removes document after expiresAt time
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Otp', otpSchema);

const mongoose = require('mongoose');

const categorySubmissionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select an award category']
    },
    submissionLink: {
      type: String,
      required: [true, 'Please provide content submission link'],
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const participantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide mobile number'],
      trim: true,
      unique: true,
      index: true
    },
    age: {
      type: Number,
      required: [true, 'Please provide age']
    },
    district: {
      type: String,
      required: [true, 'Please provide district'],
      trim: true
    },
    platform: {
      type: String,
      required: [true, 'Please specify primary content platform'],
      trim: true
    },
    // Array of category submissions managed per participant
    categorySubmissions: [categorySubmissionSchema],
    // Optional Social Links
    instagram: {
      type: String,
      trim: true,
      default: ''
    },
    youtube: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    // Additional Options
    isInternational: {
      type: Boolean,
      default: false
    },
    privacyAccepted: {
      type: Boolean,
      required: [true, 'Privacy policy acceptance is required'],
      default: true
    },
    consentAccepted: {
      type: Boolean,
      required: [true, 'Content consent acceptance is required'],
      default: true
    },
    isMobVerified: {
      type: Boolean,
      default: true
    },
    otpVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for primary/latest category
participantSchema.virtual('category').get(function () {
  if (this.categorySubmissions && this.categorySubmissions.length > 0) {
    return this.categorySubmissions[this.categorySubmissions.length - 1].category;
  }
  return null;
});

// Virtual property for primary/latest submissionLink
participantSchema.virtual('submissionLink').get(function () {
  if (this.categorySubmissions && this.categorySubmissions.length > 0) {
    return this.categorySubmissions[this.categorySubmissions.length - 1].submissionLink;
  }
  return '';
});

// Virtual property for primary/latest status
participantSchema.virtual('status').get(function () {
  if (this.categorySubmissions && this.categorySubmissions.length > 0) {
    return this.categorySubmissions[this.categorySubmissions.length - 1].status;
  }
  return 'SUBMITTED';
});

module.exports = mongoose.model('Participant', participantSchema);

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtkey_creator_awards_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const timestamp = new Date().toISOString();

    console.log(`\n===================================================`);
    console.log(`🔑 ADMIN LOGIN ATTEMPT`);
    console.log(`   Time:  ${timestamp}`);
    console.log(`   Email: ${email || 'N/A'}`);
    console.log(`===================================================`);

    if (!email || !password) {
      console.log(`❌ Login Failed: Missing email or password`);
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin user including password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      console.log(`❌ Login Failed: No admin account found with email "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!admin.active) {
      console.log(`❌ Login Failed: Account for "${email}" is deactivated`);
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      console.log(`❌ Login Failed: Password mismatch for email "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(admin._id);

    console.log(`✅ Login SUCCESSFUL`);
    console.log(`   Admin ID: ${admin._id}`);
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Token:    ${token.substring(0, 30)}...`);
    console.log(`===================================================\n`);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};

const Category = require('../models/Category');
const slugify = require('slugify');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { isActive, active, tier } = req.query;
    const filter = {};

    // Support both isActive and active query params
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true' || isActive === true;
    } else if (active !== undefined) {
      filter.isActive = active === 'true' || active === true;
    }

    if (tier) {
      filter.tier = tier;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res, next) => {
  try {
    const {
      tier,
      slug,
      title,
      shortDescription,
      taskBrief,
      hashtag,
      prizeTier,
      cashPrizeMin,
      prizeMin,
      cashPrizeMax,
      prizeMax,
      opensAt,
      closesAt,
      submissionOpens,
      submissionCloses,
      image,
      imageUrl,
      isActive,
      active
    } = req.body;

    if (!title || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and short description'
      });
    }

    const categorySlug =
      slug || slugify(title, { lower: true, strict: true });

    // Check existing slug
    const existingSlug = await Category.findOne({ slug: categorySlug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A category with this title or slug already exists'
      });
    }

    // Determine image source (Priority 1: Uploaded File, Priority 2: Direct URL String)
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    } else if (image || imageUrl) {
      imagePath = image || imageUrl;
    }

    const category = await Category.create({
      tier: tier || 'A_CULTURE_IDENTITY',
      slug: categorySlug,
      title,
      shortDescription,
      taskBrief: taskBrief || '',
      hashtag: hashtag || '',
      prizeTier: prizeTier || 'FLAGSHIP',
      cashPrizeMin: cashPrizeMin !== undefined ? Number(cashPrizeMin) : (prizeMin ? Number(prizeMin) : 0),
      cashPrizeMax: cashPrizeMax !== undefined ? Number(cashPrizeMax) : (prizeMax ? Number(prizeMax) : 0),
      submissionWindow: {
        opensAt: opensAt || submissionOpens || Date.now(),
        closesAt: closesAt || submissionCloses || null
      },
      image: imagePath,
      isActive: isActive !== undefined
        ? (isActive === 'true' || isActive === true)
        : (active !== undefined ? (active === 'true' || active === true) : true)
    });

    console.log(`\n===================================================`);
    console.log(`✨ NEW CATEGORY CREATED`);
    console.log(`   Title: ${category.title}`);
    console.log(`   Slug:  ${category.slug}`);
    console.log(`   Tier:  ${category.tier}`);
    console.log(`   Image: ${category.image || 'None'}`);
    console.log(`===================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updateFields = { ...req.body };

    if (updateFields.title && !updateFields.slug) {
      updateFields.slug = slugify(updateFields.title, {
        lower: true,
        strict: true
      });
    }

    // Image handling: File upload or Direct URL string
    if (req.file) {
      updateFields.image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    } else if (req.body.image || req.body.imageUrl) {
      updateFields.image = req.body.image || req.body.imageUrl;
    }

    // Map backwards compatibility for cash prizes & active flags
    if (req.body.prizeMin !== undefined && updateFields.cashPrizeMin === undefined) {
      updateFields.cashPrizeMin = Number(req.body.prizeMin);
    }
    if (req.body.prizeMax !== undefined && updateFields.cashPrizeMax === undefined) {
      updateFields.cashPrizeMax = Number(req.body.prizeMax);
    }
    if (req.body.active !== undefined && updateFields.isActive === undefined) {
      updateFields.isActive = req.body.active === 'true' || req.body.active === true;
    }
    if (updateFields.isActive !== undefined) {
      updateFields.isActive = updateFields.isActive === 'true' || updateFields.isActive === true;
    }

    // Map submission window if opensAt/closesAt sent separately
    if (req.body.opensAt || req.body.closesAt) {
      updateFields.submissionWindow = {
        opensAt: req.body.opensAt || category.submissionWindow?.opensAt || Date.now(),
        closesAt: req.body.closesAt || category.submissionWindow?.closesAt || null
      };
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};

const Participant = require('../models/Participant');
const Category = require('../models/Category');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalParticipants,
      pendingParticipants,
      submittedParticipants,
      approvedParticipants,
      rejectedParticipants,
      totalCategories,
      activeCategories
    ] = await Promise.all([
      Participant.countDocuments(),
      Participant.countDocuments({ status: 'PENDING' }),
      Participant.countDocuments({ status: 'SUBMITTED' }),
      Participant.countDocuments({ status: 'APPROVED' }),
      Participant.countDocuments({ status: 'REJECTED' }),
      Category.countDocuments(),
      Category.countDocuments({ isActive: true })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalParticipants,
        pendingParticipants,
        submittedParticipants,
        approvedParticipants,
        rejectedParticipants,
        totalCategories,
        activeCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};

const Otp = require('../models/Otp');
const sendSms = require('../utils/sendSms');

// @desc    Send OTP to phone
// @route   POST /api/otp/send
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
    }

    const cleanPhone = phone.trim();

    // Generate 6-digit random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Delete existing OTP entries for this phone number
    await Otp.deleteMany({ phone: cleanPhone });

    // Create new OTP record
    await Otp.create({
      phone: cleanPhone,
      otp: generatedOtp,
      expiresAt,
      verified: false
    });

    // Send SMS via Fast2SMS / Dev fallback
    const smsResult = await sendSms(cleanPhone, generatedOtp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      devMode: smsResult.devMode || false,
      // Pass OTP in dev/testing mode when Fast2SMS key is absent
      ...(smsResult.devMode ? { devOtp: generatedOtp } : {})
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and OTP'
      });
    }

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    const otpRecord = await Otp.findOne({ phone: cleanPhone });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // Mark OTP record as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      phone: cleanPhone,
      otpVerified: true
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};

const Participant = require('../models/Participant');
const Otp = require('../models/Otp');
const Category = require('../models/Category');

// @desc    Submit participation / nomination form (Creates or updates single participant document with category nomination)
// @route   POST /api/participants
// @access  Public
const createParticipant = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      district,
      platform,
      category,
      submissionLink,
      instagram,
      youtube,
      twitter,
      linkedin,
      isInternational,
      privacyAccepted,
      consentAccepted
    } = req.body;

    console.log(`\n===================================================`);
    console.log(`📝 PARTICIPANT NOMINATION SUBMISSION`);
    console.log(`   Name:     ${fullName || 'N/A'}`);
    console.log(`   Phone:    ${phone || 'N/A'}`);
    console.log(`   Category: ${category || 'N/A'}`);
    console.log(`===================================================`);

    // Basic required field validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !age ||
      !district ||
      !platform ||
      !category ||
      !submissionLink
    ) {
      console.log(`❌ Validation Failed: Missing required fields`);
      return res.status(400).json({
        success: false,
        message: 'Please fill all required basic information fields (fullName, email, phone, age, district, platform, category, submissionLink)'
      });
    }

    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    // Verify category existence (either by ID or Slug)
    let categoryObj;
    const catStr = String(category).trim();
    if (catStr.match(/^[0-9a-fA-F]{24}$/)) {
      categoryObj = await Category.findById(catStr);
    } else {
      categoryObj = await Category.findOne({ slug: catStr });
    }

    if (!categoryObj) {
      console.log(`❌ Submission Failed: Award category "${catStr}" does not exist in database`);
      return res.status(404).json({
        success: false,
        message: `Selected award category "${catStr}" does not exist in database. Please check available categories at GET /api/categories`
      });
    }

    // Check if participant document ALREADY exists for this mobile number or email
    let participant = await Participant.findOne({
      $or: [{ phone: cleanPhone }, { email: cleanEmail }]
    });

    // Determine OTP verification status
    if (!participant) {
      // For new participants, check active verified OTP record
      const verifiedOtp = await Otp.findOne({
        phone: cleanPhone,
        verified: true
      });

      if (!verifiedOtp) {
        console.log(`❌ Submission Failed: Mobile number "${cleanPhone}" is not verified via OTP`);
        return res.status(400).json({
          success: false,
          message: `Mobile number ${cleanPhone} has not been verified via OTP. Please complete OTP verification first.`
        });
      }
    }

    const initialStatus = req.body.status ? req.body.status.toUpperCase() : 'SUBMITTED';
    const newSubmission = {
      category: categoryObj._id,
      submissionLink,
      status: initialStatus,
      submittedAt: new Date()
    };

    if (participant) {
      // Participant ALREADY exists -> Update profile & manage category submission inside categorySubmissions array!
      participant.fullName = fullName;
      participant.email = cleanEmail;
      participant.age = age;
      participant.district = district;
      participant.platform = platform;
      if (instagram !== undefined) participant.instagram = instagram;
      if (youtube !== undefined) participant.youtube = youtube;
      if (twitter !== undefined) participant.twitter = twitter;
      if (linkedin !== undefined) participant.linkedin = linkedin;
      if (isInternational !== undefined) participant.isInternational = isInternational;
      participant.isMobVerified = true;
      participant.otpVerified = true;

      // Check if this category has already been submitted by this participant
      const existingSubIndex = participant.categorySubmissions.findIndex(
        (sub) => sub.category.toString() === categoryObj._id.toString()
      );

      if (existingSubIndex > -1) {
        console.log(`❌ Submission Failed: Participant "${fullName}" has already nominated for category "${categoryObj.title}"`);
        return res.status(400).json({
          success: false,
          message: `You have already submitted a nomination for the "${categoryObj.title}" category. Duplicate nominations for the same category are not allowed.`
        });
      }

      // Push new category submission to participant's categorySubmissions array
      participant.categorySubmissions.push(newSubmission);

      await participant.save();
    } else {
      // Create single participant profile with first category submission
      participant = await Participant.create({
        fullName,
        email: cleanEmail,
        phone: cleanPhone,
        age,
        district,
        platform,
        categorySubmissions: [newSubmission],
        instagram: instagram || '',
        youtube: youtube || '',
        twitter: twitter || '',
        linkedin: linkedin || '',
        isInternational: isInternational || false,
        privacyAccepted: true,
        consentAccepted: true,
        isMobVerified: true,
        otpVerified: true
      });

      // Clean up active OTP record after successful first registration
      await Otp.deleteMany({ phone: cleanPhone });
    }

    const populatedParticipant = await Participant.findById(participant._id).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    console.log(`✅ Participant Category Nomination Saved Successfully!`);
    console.log(`   Participant ID: ${participant._id}`);
    console.log(`   Category Title: ${categoryObj.title}`);
    console.log(`   Total Categories Entered: ${participant.categorySubmissions.length}`);
    console.log(`===================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Category nomination submitted successfully',
      participant: populatedParticipant
    });
  } catch (error) {
    console.error(`❌ Submission Error:`, error.message);
    next(error);
  }
};

// @desc    Get all participants
// @route   GET /api/participants
// @access  Admin
const getParticipants = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const participants = await Participant.find(filter)
      .populate(
        'categorySubmissions.category',
        'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Participant.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: participants.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      participants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get participant profile (by phone, email, or id)
// @route   GET /api/participants/profile
// @access  Public / Admin
const getParticipantProfile = async (req, res, next) => {
  try {
    const { phone, email, id } = req.query;

    if (!phone && !email && !id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number, email address, or participant ID as a query parameter (e.g., /api/participants/profile?phone=9274322242)'
      });
    }

    const filter = {};
    if (id) {
      filter._id = id;
    } else if (phone) {
      filter.phone = String(phone).trim();
    } else if (email) {
      filter.email = String(email).trim().toLowerCase();
    }

    const participant = await Participant.findOne(filter).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant profile not found'
      });
    }

    res.status(200).json({
      success: true,
      participant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single participant details by ID
// @route   GET /api/participants/:id
// @access  Admin
const getParticipantById = async (req, res, next) => {
  try {
    const participant = await Participant.findById(req.params.id).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      participant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update participant status for specific category or overall
// @route   PUT /api/participants/:id/status
// @access  Admin
const updateParticipantStatus = async (req, res, next) => {
  try {
    const { status, categoryId, category } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const upperStatus = status.toUpperCase();
    const validStatuses = ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'];

    if (!validStatuses.includes(upperStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Update status inside categorySubmissions array
    if (categoryId || category) {
      const targetCatId = categoryId || category;
      const subIndex = participant.categorySubmissions.findIndex(
        (sub) => sub.category.toString() === targetCatId.toString() || sub._id.toString() === targetCatId.toString()
      );
      if (subIndex > -1) {
        participant.categorySubmissions[subIndex].status = upperStatus;
      }
    } else {
      // Update status for all category submissions
      participant.categorySubmissions.forEach((sub) => {
        sub.status = upperStatus;
      });
    }

    await participant.save();

    const populatedParticipant = await Participant.findById(participant._id).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    res.status(200).json({
      success: true,
      message: `Participant status updated to ${upperStatus}`,
      participant: populatedParticipant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete participant
// @route   DELETE /api/participants/:id
// @access  Admin
const deleteParticipant = async (req, res, next) => {
  try {
    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    await Participant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Participant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParticipant,
  getParticipants,
  getParticipantProfile,
  getParticipantById,
  updateParticipantStatus,
  deleteParticipant
};

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const participantRoutes = require('./routes/participantRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true
  })
);
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory for uploaded category images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Government Creator Awards Portal - API Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
