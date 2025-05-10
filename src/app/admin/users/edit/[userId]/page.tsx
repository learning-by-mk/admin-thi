'use client'

import { useParams } from 'next/navigation';
import React from 'react'

export default function UserEditPage() {
    const { userId } = useParams();
    return (
        <div>
            <h1>User Edit {userId}</h1>
        </div>
    )
}