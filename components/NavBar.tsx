import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  return (
    <div className='flex justify-between items-center bg-white px-32 py-8'>
        {/* gauche */}
        <div>
            <h1 className='text-3xl font-semibold italic text-blue-600'>StatAi</h1>
        </div>
        <div>
            <Link href="/Etablissement"><span className="text-blue-600 px-4 py-2 rounded-lg">Etablissement</span></Link>
            <Link href="/Etudiant"><span className="text-blue-600 px-4 py-2 rounded-lg">Etudiant</span></Link>
            <Link href="/Tarifs"><span className="text-blue-600 px-4 py-2 rounded-lg">Tarifs</span></Link>
        </div>
        <div>
            <Link href="/"><span className="bg-blue-600 text-white px-4 py-2 rounded-lg">Se connecter</span></Link>
        </div>
    </div>
  )
}

export default NavBar