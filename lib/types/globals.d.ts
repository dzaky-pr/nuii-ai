export {}

// Create a type for the roles
export type Roles = 'admin' | 'surveyor' | 'pengawas'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
