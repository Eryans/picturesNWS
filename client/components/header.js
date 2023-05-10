import Image from 'next/image'
import Link from 'next/link';

export default function Header() {
  return (
    <div style={{display: 'flex', flexDirection: 'row-reverse', height: 100}}>
        <div style={{margin: 20}}><Link href="/login">Se connecter</Link></div>
        <div style={{margin: 20}} className="link"><Link href="/login">Gérer mon compte</Link></div>
    </div>
  )
}