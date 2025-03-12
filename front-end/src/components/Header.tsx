import React from 'react'

const Header = ({title, subtitle, rightElement }: HeaderProps) => {
  return (
    <div className='Header'>
        <div>
            <h1 className='Header__title'>{title}</h1>
            <p className='Header__subtitle'>{subtitle}</p>     
        </div>
        {rightElement && <div>{rightElement}</div>}
    </div>
  )
}

export default Header