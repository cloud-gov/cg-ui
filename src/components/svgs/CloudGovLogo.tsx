export default function CloudGovLogo({
  text = true,
  textColor = '#F8F9FA',
}: {
  text?: boolean;
  textColor?: string;
}) {
  return (
    <svg
      id="cloud-gov-logo"
      width="100%"
      height="100%"
      viewBox="0 0 130 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        id="cloud-gov-star"
        fill="white"
        x="4"
        y="6"
        width="14"
        height="15"
      />
      <path
        id="cloud-gov-icon-bottom"
        fill="#2D2E2F"
        d="M22.2895 8.21486V20.9493L11.1447 29L0 20.9493V8.18593L4.52345 11.6649L8.45688 14.7813L6.81795 19.7806L11.1447 16.6642L15.4715 19.7806L13.767 14.7813L17.766 11.6649L22.2895 8.21486Z"
      />
      <path
        id="cloud-gov-icon-top"
        fill="#2672DE"
        d="M22.29 8.22L17.7344 11.6866H12.7451L11.1111 6.60258L9.47712 11.6866H4.53729L0 8.1872L11.1111 0L22.29 8.22Z"
      />
      {text ? (
        <path
          id="cloud-gov-text"
          fill={textColor}
          d="M125.018 17.1836L127.968 9.06791H130L125.739 19.6507H124.1L119.839 9.06791H122.002L124.952 17.1836H125.018ZM112.3 18.2224C112.824 18.2224 113.348 18.1575 113.807 17.9627C114.266 17.7679 114.66 17.5082 114.987 17.1187C115.315 16.7291 115.577 16.3396 115.709 15.8851C115.905 15.4306 115.971 14.9112 115.971 14.3269C115.971 13.8075 115.905 13.2881 115.709 12.8336C115.577 12.3791 115.315 11.9896 114.987 11.6C114.66 11.2754 114.266 10.9507 113.807 10.756C113.348 10.5612 112.824 10.4313 112.3 10.4313C111.71 10.4313 111.251 10.4963 110.792 10.756C110.333 10.9507 109.939 11.2104 109.612 11.6C109.284 11.9246 109.022 12.3791 108.891 12.8336C108.694 13.353 108.628 13.8075 108.628 14.3269C108.628 14.9112 108.694 15.4306 108.891 15.8851C109.087 16.3396 109.349 16.794 109.677 17.1187C110.005 17.4433 110.398 17.7679 110.857 17.9627C111.251 18.1575 111.71 18.2224 112.3 18.2224ZM112.234 8.80821C113.086 8.80821 113.807 8.93806 114.528 9.19776C115.184 9.45746 115.84 9.84702 116.364 10.3015C116.889 10.756 117.282 11.4052 117.544 12.0545C117.806 12.7037 118.003 13.4828 118.003 14.3269C118.003 15.1709 117.872 15.8851 117.544 16.5993C117.282 17.2485 116.889 17.8328 116.364 18.3522C115.84 18.8716 115.25 19.2612 114.528 19.5209C113.807 19.7806 113.086 19.9104 112.234 19.9104C111.382 19.9104 110.661 19.7806 109.939 19.5209C109.284 19.2612 108.628 18.8716 108.104 18.3522C107.579 17.8328 107.186 17.2485 106.924 16.5993C106.662 15.95 106.465 15.1709 106.465 14.3269C106.465 13.4828 106.596 12.7037 106.924 12.0545C107.186 11.4052 107.579 10.8209 108.104 10.3015C108.628 9.78209 109.218 9.45746 109.939 9.19776C110.661 8.93806 111.447 8.80821 112.234 8.80821ZM95.3202 10.3015C95.8447 9.78209 96.5002 9.45746 97.1558 9.19776C97.8769 8.93806 98.5981 8.80821 99.4503 8.80821C100.303 8.80821 101.089 8.93806 101.81 9.19776C102.532 9.45746 103.056 9.78209 103.515 10.1716L102.204 11.6C101.941 11.2754 101.548 11.0157 101.089 10.8209C100.565 10.6261 100.04 10.4963 99.5159 10.4963C98.9259 10.4963 98.467 10.5612 98.0081 10.8209C97.5492 11.0157 97.1558 11.2754 96.828 11.6649C96.5002 11.9896 96.238 12.444 96.1069 12.8985C95.9102 13.4179 95.8447 13.8724 95.8447 14.3918C95.8447 14.9761 95.9102 15.4955 96.1069 15.95C96.3036 16.4045 96.5002 16.859 96.828 17.1836C97.1558 17.5082 97.5492 17.8328 98.0081 18.0276C98.467 18.2224 98.9914 18.2873 99.5814 18.2873C100.368 18.2873 101.089 18.1575 101.679 17.8978V15.2358H99.4503V13.6776H103.515V19.1313C102.99 19.391 102.4 19.5858 101.745 19.7157C101.089 19.8455 100.368 19.9104 99.5159 19.9104C98.6636 19.9104 97.8769 19.7806 97.1558 19.5209C96.4347 19.2612 95.8447 18.8716 95.3202 18.3522C94.7957 17.8328 94.4024 17.2485 94.1402 16.5993C93.878 15.95 93.7468 15.1709 93.7468 14.3269C93.7468 13.4828 93.8779 12.7037 94.2057 12.0545C94.4024 11.4052 94.7957 10.8209 95.3202 10.3015ZM91.1901 19.391C90.9279 19.5858 90.6656 19.7157 90.3379 19.7157C90.2067 19.7157 90.0101 19.7157 89.879 19.6507C89.7478 19.5858 89.6167 19.5209 89.4856 19.391C89.3545 19.3261 89.2889 19.1963 89.2234 19.0664C89.1578 18.9366 89.1578 18.8067 89.1578 18.6119C89.1578 18.2873 89.2889 18.0276 89.4856 17.7679C89.7478 17.5082 90.0101 17.4433 90.3379 17.4433C90.6656 17.4433 90.9279 17.5731 91.1901 17.7679C91.4523 17.9627 91.5834 18.2873 91.5834 18.547C91.5834 18.8067 91.3868 19.1963 91.1901 19.391ZM86.4044 16.7291C86.0766 17.3784 85.6177 17.9627 85.0277 18.3522C84.4377 18.7418 83.7821 19.1313 83.1266 19.3261C82.471 19.5209 81.7499 19.6507 81.0287 19.6507H77.2264V9.06791H81.0287C81.7499 9.06791 82.4054 9.13284 83.1266 9.32761C83.7821 9.52239 84.4377 9.78209 85.0277 10.2366C85.6177 10.6261 86.0766 11.2104 86.4044 11.8597C86.7322 12.509 86.9289 13.353 86.9289 14.3918C86.9289 15.3007 86.7322 16.0799 86.4044 16.7291ZM83.5199 17.2485C83.9133 16.9888 84.241 16.5993 84.5033 16.1448C84.7655 15.6903 84.8966 15.106 84.8966 14.3918C84.8966 13.6127 84.7655 13.0284 84.5033 12.509C84.241 12.0545 83.9133 11.6649 83.5199 11.4052C83.1266 11.1455 82.6677 10.9507 82.2088 10.8209C81.7499 10.756 81.2254 10.691 80.7665 10.691H79.1931V18.0276H80.7665C81.291 18.0276 81.7499 17.9627 82.2088 17.8328C82.6677 17.703 83.1266 17.5082 83.5199 17.2485ZM69.1629 19.9104C68.5729 19.9104 67.9828 19.8455 67.4584 19.6507C66.9339 19.456 66.475 19.1963 66.0817 18.8067C65.6883 18.4172 65.3606 18.0276 65.1639 17.5082C64.9672 16.9888 64.8361 16.4045 64.8361 15.7552V9.06791H66.7373V15.6903C66.7373 16.0149 66.8028 16.3396 66.8684 16.5993C66.9339 16.9239 67.065 17.1836 67.2617 17.3784C67.4584 17.6381 67.7206 17.8328 67.9828 17.9627C68.3106 18.0925 68.6384 18.1575 69.0973 18.1575C69.5562 18.1575 69.9496 18.0925 70.2118 17.9627C70.5396 17.8328 70.7362 17.6381 70.9329 17.3784C71.1296 17.1187 71.2607 16.859 71.3263 16.5993C71.3918 16.2746 71.4574 16.0149 71.4574 15.6903V9.06791H73.3585V15.7552C73.3585 16.4045 73.2274 16.9888 73.0308 17.5082C72.8341 18.0276 72.5063 18.4172 72.1129 18.8067C71.7196 19.1963 71.2607 19.456 70.7362 19.6507C70.3429 19.8455 69.7529 19.9104 69.1629 19.9104ZM55.8548 18.2224C56.3792 18.2224 56.9037 18.1575 57.3626 17.9627C57.8215 17.7679 58.2148 17.5082 58.5426 17.1187C58.8704 16.7291 59.1326 16.3396 59.3293 15.8851C59.526 15.4306 59.5915 14.9112 59.5915 14.3269C59.5915 13.8075 59.526 13.2881 59.3293 12.8336C59.1982 12.3791 58.9359 11.9896 58.6082 11.6C58.2804 11.2754 57.887 10.9507 57.4281 10.756C56.9692 10.5612 56.4448 10.4313 55.9203 10.4313C55.3959 10.4313 54.8714 10.4963 54.4125 10.756C53.9536 10.9507 53.5602 11.2104 53.2325 11.6C52.9047 11.9246 52.6424 12.3791 52.5113 12.8336C52.3147 13.353 52.2491 13.8075 52.2491 14.3269C52.2491 14.9112 52.3147 15.4306 52.5113 15.8851C52.708 16.3396 52.9702 16.794 53.298 17.1187C53.6258 17.4433 54.0191 17.7679 54.4781 17.9627C54.8058 18.1575 55.3303 18.2224 55.8548 18.2224ZM55.8548 8.80821C56.707 8.80821 57.4281 8.93806 58.1493 9.19776C58.8048 9.45746 59.4604 9.84702 59.9849 10.3015C60.5093 10.8209 60.9027 11.4052 61.1649 12.0545C61.4271 12.7037 61.6238 13.4828 61.6238 14.3269C61.6238 15.1709 61.4927 15.8851 61.1649 16.5993C60.9027 17.2485 60.5093 17.8328 59.9849 18.3522C59.4604 18.8716 58.8704 19.2612 58.1493 19.5209C57.4281 19.7806 56.707 19.9104 55.8548 19.9104C55.0025 19.9104 54.2814 19.7806 53.5602 19.5209C52.9047 19.2612 52.2491 18.8716 51.7246 18.3522C51.2002 17.8328 50.8068 17.2485 50.5446 16.5993C50.2824 15.95 50.0857 15.1709 50.0857 14.3269C50.0857 13.4828 50.2168 12.7037 50.5446 12.0545C50.8068 11.4052 51.2002 10.8209 51.7246 10.3015C52.2491 9.78209 52.8391 9.45746 53.5602 9.19776C54.2814 8.93806 55.0025 8.80821 55.8548 8.80821ZM48.3812 17.9627V19.6507H41.9566V9.06791H43.8578V17.9627H48.3812ZM35.2698 10.4963C34.7453 10.4963 34.2209 10.6261 33.762 10.8209C33.3031 11.0157 32.9097 11.2754 32.5819 11.6649C32.2541 11.9896 31.9919 12.444 31.8608 12.8985C31.6641 13.4179 31.5986 13.8724 31.5986 14.3918C31.5986 14.9761 31.6641 15.4955 31.8608 15.95C32.0575 16.4045 32.2541 16.859 32.5819 17.1836C32.9097 17.5082 33.3031 17.7679 33.6964 17.9627C34.1553 18.1575 34.6142 18.2224 35.2042 18.2224C35.7942 18.2224 36.3187 18.0925 36.712 17.8978C37.1709 17.703 37.4987 17.3784 37.761 16.9888L39.2688 18.0276C38.8099 18.6119 38.2199 19.0664 37.5643 19.391C36.9087 19.7157 36.0565 19.8455 35.1387 19.8455C34.2864 19.8455 33.4997 19.7157 32.8442 19.456C32.1886 19.1963 31.533 18.8067 31.0086 18.2873C30.4841 17.7679 30.0908 17.1836 29.8285 16.5343C29.5663 15.8851 29.3696 15.106 29.3696 14.2619C29.3696 13.4179 29.5007 12.6388 29.8285 11.9896C30.0908 11.3403 30.5497 10.756 31.0741 10.2366C31.5986 9.71717 32.2541 9.39254 32.9097 9.13284C33.6309 8.87314 34.352 8.74329 35.2042 8.74329C35.532 8.74329 35.9254 8.80821 36.2531 8.80821C36.6465 8.87314 36.9743 8.93806 37.3021 9.13284C37.6298 9.32761 37.9576 9.45747 38.2854 9.65224C38.6132 9.84702 38.8099 10.1067 39.0721 10.3664L37.6298 11.4702C37.3676 11.0806 36.9743 10.8209 36.5154 10.6261C36.1876 10.5612 35.7287 10.4963 35.2698 10.4963Z"
        />
      ) : null}
    </svg>
  );
}
