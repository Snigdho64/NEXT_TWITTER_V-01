import React from 'react'

const SidebarLink: React.FC<{
  Icon: (props: React.ComponentProps<'svg'>) => JSX.Element
  text: string
  active?: Boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}> = ({ Icon, text, active, onClick }): JSX.Element => {
  return (
    <div
      className={`hoverAnimation m-auto flex min-w-[52px] items-center justify-center space-x-3 text-xl text-[#d9d9d9] sm:w-full xl:justify-start ${
        active &&
        'rounded-full bg-sky-500 bg-opacity-100 font-bold text-white'
      }`}
      onClick={onClick}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  )
}

export default SidebarLink
