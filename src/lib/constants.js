export const NAV_LINKS = [
  { label: 'New In', to: '/shop?sort=newest' },
  { label: 'Women', to: '/shop?category=women' },
  { label: 'Men', to: '/shop?category=men' },
  { label: 'Accessories', to: '/shop?category=accessories' },
  { label: 'Sale', to: '/shop?sale=true' },
];

export const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Best Sellers', to: '/shop?sort=bestsellers' },
      { label: 'Flash Sale', to: '/shop?sale=true' },
      { label: 'All Products', to: '/shop' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Track Your Order', to: '/track-order' },
      { label: 'Customer Support', to: '/support' },
      { label: 'Shipping & Returns', to: '/support#shipping' },
      { label: 'Size Guide', to: '/support#size-guide' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Order History', to: '/account/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Addresses', to: '/account/addresses' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About PandaWorld', to: '/support#about' },
      { label: 'Sustainability', to: '/support#about' },
      { label: 'Careers', to: '/support#about' },
      { label: 'Contact', to: '/support#contact' },
    ],
  },
];

export const ORDER_STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
