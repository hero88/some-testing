import PropTypes from 'prop-types'

const ResetPasswordIcon = ({ size, color }) => {
  return (
    <svg
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px' y='0px' width={`${size}px`} height={`${size}px`} viewBox='0 0 106.079 122.879'
      enableBackground='new 0 0 106.079 122.879' xmlSpace='preserve'
    >
      <g>
        <path fill={color} fillRule='evenodd' clipRule='evenodd' d='M43.146,62.341L32.389,81.274l2.012,7.505l7.452-1.997l-1.512-5.642l6.174-1.654 l-1.654-6.175l5.191-0.34l0.217-6.023c3.206,1.086,6.791,1.265,10.349,0.312c9.315-2.496,14.919-11.806,12.512-20.789 c-2.407-8.984-11.915-14.244-21.23-11.749c-9.314,2.496-14.918,11.806-12.51,20.79C40.093,58.141,41.407,60.451,43.146,62.341 L43.146,62.341L43.146,62.341z M63.191,118.729c0.936,0.983,0.896,2.539-0.086,3.474c-0.983,0.936-2.539,0.896-3.475-0.087 l-7.876-8.298c-0.897-0.943-0.897-2.413-0.028-3.357l7.876-8.576c0.919-0.999,2.475-1.063,3.474-0.145s1.063,2.475,0.145,3.474 l-3.315,3.609c15.661-2.799,26.639-10.495,33.299-20.363c4.664-6.911,7.231-14.897,7.822-23.016 c0.593-8.152-0.798-16.427-4.05-23.878c-5.176-11.862-15.08-21.651-29.21-25.526c-1.308-0.356-2.079-1.704-1.723-3.012 c0.355-1.307,1.704-2.079,3.012-1.723C84.753,15.61,95.745,26.46,101.48,39.603c3.573,8.188,5.102,17.262,4.453,26.187 c-0.652,8.957-3.49,17.778-8.649,25.422c-7.653,11.338-20.372,20.068-38.58,22.79L63.191,118.729L63.191,118.729z M43.065,4.15 c-0.936-0.983-0.896-2.539,0.087-3.474c0.982-0.935,2.538-0.896,3.474,0.087l7.876,8.299c0.897,0.943,0.898,2.414,0.028,3.357 l-7.875,8.576c-0.92,0.999-2.476,1.064-3.475,0.145c-0.998-0.919-1.063-2.475-0.145-3.474l3.563-3.879 c-13.063,1.565-23.924,8.677-31.28,18.435c-5.057,6.708-8.457,14.652-9.783,22.898c-1.32,8.217-0.581,16.738,2.635,24.634 c4.656,11.434,14.555,21.591,30.976,27.67c1.275,0.467,1.93,1.881,1.462,3.156c-0.467,1.275-1.881,1.93-3.156,1.463 C19.582,105.427,8.757,94.242,3.609,81.602C0.048,72.856-0.773,63.43,0.686,54.351C2.141,45.3,5.862,36.595,11.392,29.259 c8.384-11.12,20.924-19.129,36.044-20.505L43.065,4.15L43.065,4.15z M57.285,45.128c-1.662,0.446-2.65,2.156-2.204,3.819 c0.445,1.663,2.156,2.65,3.819,2.205s2.65-2.156,2.204-3.819C60.659,45.67,58.949,44.683,57.285,45.128L57.285,45.128z'/>
      </g>
    </svg>
  )
}

ResetPasswordIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
}

export default ResetPasswordIcon