import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-blue-600 text-white px-32 py-8 mt-12'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-semibold italic'>StatAi</h2>
          <p className='text-sm mt-2'>Plateforme de statistiques éducatives</p>
        </div>
        <div className='flex gap-8'>
          <div>
            <h3 className='font-semibold mb-2'>Navigation</h3>
            <ul className='text-sm space-y-1'>
              <li><a href="/Etablissement" className='hover:underline'>Établissement</a></li>
              <li><a href="/Etudiant" className='hover:underline'>Étudiant</a></li>
              <li><a href="/Tarifs" className='hover:underline'>Tarifs</a></li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Contact</h3>
            <p className='text-sm'>support@statai.com</p>
          </div>
        </div>
      </div>
      <div className='border-t border-blue-400 mt-8 pt-4 text-center text-sm'>
        <p>&copy; 2026 StatAi. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer
