import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const Profile = () => {
  return (
    <div className='p-10'>
        {/* <h2 className="font-bold text-2xl">Profile</h2> */}
        <UserProfile/>
      
    </div>
  )
}

export default Profile
