import { 
  loginSchema, 
  registerSchema, 
  passwordResetSchema,
  loftSchema,
  taskSchema 
} from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email')
      }
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required')
      }
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        full_name: 'John Doe'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        full_name: 'John Doe'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('8 characters')
        )).toBe(true)
      }
    })

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        full_name: 'John Doe'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('uppercase')
        )).toBe(true)
      }
    })

    it('should reject password without lowercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PASSWORD123',
        full_name: 'John Doe'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('lowercase')
        )).toBe(true)
      }
    })

    it('should reject password without numbers', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password',
        full_name: 'John Doe'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('number')
        )).toBe(true)
      }
    })

    it('should reject short full name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        full_name: 'A'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 characters')
      }
    })
  })

  describe('passwordResetSchema', () => {
    it('should validate matching passwords', () => {
      const validData = {
        password: 'Password123',
        confirmPassword: 'Password123'
      }

      const result = passwordResetSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject non-matching passwords', () => {
      const invalidData = {
        password: 'Password123',
        confirmPassword: 'DifferentPassword123'
      }

      const result = passwordResetSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("don't match")
      }
    })
  })

  describe('loftSchema', () => {
    it('should validate correct loft data', () => {
      const validData = {
        name: 'Test Loft',
        address: '123 Test Street',
        price_per_month: 1000,
        status: 'available' as const,
        owner_id: 'owner-123',
        company_percentage: 30,
        owner_percentage: 70
      }

      const result = loftSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative price', () => {
      const invalidData = {
        name: 'Test Loft',
        address: '123 Test Street',
        price_per_month: -100,
        status: 'available' as const,
        owner_id: 'owner-123',
        company_percentage: 30,
        owner_percentage: 70
      }

      const result = loftSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive')
      }
    })

    it('should reject invalid status', () => {
      const invalidData = {
        name: 'Test Loft',
        address: '123 Test Street',
        price_per_month: 1000,
        status: 'invalid-status' as any,
        owner_id: 'owner-123',
        company_percentage: 30,
        owner_percentage: 70
      }

      const result = loftSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('taskSchema', () => {
    it('should validate correct task data', () => {
      const validData = {
        title: 'Test Task',
        description: 'Test description',
        status: 'todo' as const,
        due_date: '2024-12-31',
        assigned_to: 'user-123'
      }

      const result = taskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        status: 'todo' as const
      }

      const result = taskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required')
      }
    })

    it('should accept null values for optional fields', () => {
      const validData = {
        title: 'Test Task',
        description: null,
        status: 'todo' as const,
        due_date: null,
        assigned_to: null
      }

      const result = taskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})