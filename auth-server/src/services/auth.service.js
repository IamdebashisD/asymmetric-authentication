import ApiError from "../utils/api-error.js";
import User from '../models/user.model.js'
import RefreshToken from "../models/refresh-token.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { 
    generateAccessToken, 
    generateRefreshToken, 
    getRefreshTokenExpiry 
} from "../utils/jwt.js";
import { v4 as uuidv4 } from 'uuid'



export const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw ApiError.conflict('Email already exists')
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await User.create({ 
        name, 
        email, 
        password: hashedPassword  
    })

    const user = newUser.toObject()
    delete user.password
    
    return user
}

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        throw ApiError.unauthorized('Invalid email or password')
    }

    const isPasswordValid = await comparePassword(
        password,
        user.password
    )

    if (!isPasswordValid) {
        throw ApiError.unauthorized("Invalid email or password")
    }

    const accessToken = generateAccessToken({
        sub: user._id.toString(),
        email: user.email,
        role: user.role
    })

    const refreshToken = generateRefreshToken()
    const familyId = uuidv4()
    const expiresAt = getRefreshTokenExpiry()

    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt,
        familyId
    })

    const userObject = user.toObject()
    delete userObject.password
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    return {
        user: userObject,
        accessToken,
        refreshToken
    }
} 

export const refreshToken = async (token) => {
    const refreshTokenDoc = await RefreshToken.findOne({ token })
    if (!refreshTokenDoc) {
        throw ApiError.unauthorized('Invalid refresh token')
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
        throw ApiError.unauthorized('Refresh token has expired')
    }

    const user = await User.findById(refreshTokenDoc.user)
    if (!user) {
        throw ApiError.notFound("User not found")
    }

    const accessToken = generateAccessToken({
        sub: user._id.toString(),
        email: user.email
    })

    const newRefreshToken = generateRefreshToken()

    const expiresAt = getRefreshTokenExpiry()
    
    await RefreshToken.create({
        token: newRefreshToken,
        user: user._id,
        expiresAt
    })

    await RefreshToken.deleteOne({ _id: refreshTokenDoc._id })

    return { accessToken, newRefreshToken }
}

export const logout = async (token) => {
    const refreshTokenDoc = await RefreshToken.findOne({ token })

    if (!refreshTokenDoc) {
        throw ApiError.unauthorized("Invalid refresh token");
    }

    await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
}

export const profile = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw ApiError.notFound('User not found')
    }

    return user
}
