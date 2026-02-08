'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const dashboardProductImages = [
  '/btee.png',
  '/Gildan_64000png.png',
  '/hoodiepng1.png',
  '/hoodiepng2.png',
  '/longsleevepng1.png',
  '/sweatshirtpng1.png',
  '/tshirtpng1.png',
  '/tshirtpng2.png'
];
const tshirtImageIndices = [6, 7];
const nonTshirtImageIndices = [0, 1, 2, 3, 4, 5];

type OrderStatus = 'Order received' | 'Printing' | 'Packed' | 'Shipped' | 'Arrived';

const OTHER_STATES = ['NJ', 'CT', 'MA', 'DE', 'PA', 'MD', 'ME', 'VT', 'NH', 'RI'] as const;

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function randomOrderId(len = 8): string {
  let s = '';
  for (let i = 0; i < len; i++) s += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  return s;
}

const FIRST_NAMES = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Isabella', 'Lucas', 'Mia', 'Mason', 'Charlotte', 'Ethan', 'Amelia'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson'];
function randomName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

function buildMockOrders(): { id: number; orderId: string; name: string; orderDate: string; dateSortKey: number; status: OrderStatus; state: string; imageIndex: number }[] {
  const today = new Date();
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const orders: { id: number; orderId: string; name: string; orderDate: string; dateSortKey: number; status: OrderStatus; state: string; imageIndex: number }[] = [];
  let id = 1;
  for (let daysAgo = 0; daysAgo <= 7; daysAgo++) {
    for (let i = 0; i < 2; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgo);
      let status: OrderStatus;
      if (daysAgo >= 3) status = 'Arrived';
      else if (daysAgo === 2) status = 'Shipped';
      else if (daysAgo === 1) status = 'Shipped';
      else status = i === 0 ? 'Order received' : 'Packed';
      const isNY = (id - 1) % 2 === 0;
      const state = isNY ? 'NY' : OTHER_STATES[(id - 1) % OTHER_STATES.length];
      const isTshirt = (id - 1) % 2 === 0;
      const imageIndex = isTshirt
        ? tshirtImageIndices[(id - 1) % tshirtImageIndices.length]
        : nonTshirtImageIndices[(id - 1) % nonTshirtImageIndices.length];
      orders.push({
        id,
        orderId: randomOrderId(),
        name: randomName(),
        orderDate: formatDate(d),
        dateSortKey: d.getTime(),
        status,
        state,
        imageIndex
      });
      id++;
    }
  }
  orders.sort((a, b) => b.dateSortKey - a.dateSortKey);
  return orders.map((o, i) => ({ ...o, id: i + 1 }));
}

const ITEMS_PER_PAGE = 10;

const statusBadgeStyle: Record<OrderStatus, React.CSSProperties> = {
  'Order received': {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(59, 130, 246, 0.06) 100%)',
    color: '#1e40af',
    border: '1px solid rgba(59, 130, 246, 0.22)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 2px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
    letterSpacing: '0.02em'
  },
  'Printing': {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0.06) 100%)',
    color: '#c2410c',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 2px rgba(245, 158, 11, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
    letterSpacing: '0.02em'
  },
  'Packed': {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.14) 0%, rgba(34, 197, 94, 0.06) 100%)',
    color: '#166534',
    border: '1px solid rgba(34, 197, 94, 0.22)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 2px rgba(34, 197, 94, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
    letterSpacing: '0.02em'
  },
  'Shipped': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0.06) 100%)',
    color: '#5b21b6',
    border: '1px solid rgba(139, 92, 246, 0.22)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 2px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
    letterSpacing: '0.02em'
  },
  'Arrived': {
    background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.12) 0%, rgba(107, 114, 128, 0.05) 100%)',
    color: '#4b5563',
    border: '1px solid rgba(107, 114, 128, 0.18)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
    letterSpacing: '0.02em'
  }
};

export default function OrderPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const mockOrders = useMemo(buildMockOrders, []);
  const totalPages = Math.ceil(mockOrders.length / ITEMS_PER_PAGE);
  const pageOrders = mockOrders.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
      {/* 左サイドバー */}
      <div
        style={{
          width: '65px',
          backgroundColor: 'black',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '0.5rem'
        }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          aria-label="Back to dashboard"
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Image
            src="/gblack2.png"
            alt="Godship Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </button>
        <div style={{ marginTop: '0.5rem' }}>
          <button
            onClick={() => router.push('/dashboard/order')}
            aria-label="Order"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Image
              src="/order.png"
              alt="Order"
              width={30}
              height={30}
              className="object-contain"
            />
          </button>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => router.push('/dashboard/settings')}
            aria-label="Settings"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Image
              src="/settings.png"
              alt="Settings"
              width={30}
              height={30}
              className="object-contain"
            />
          </button>
        </div>
      </div>
      {/* メインコンテンツエリア */}
      <div style={{ marginLeft: '75px', padding: '1rem', flex: 1 }}>
        <div style={{ paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111' }}>
              Orders
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '8px',
                  background: currentPage === 0 ? 'rgba(0,0,0,0.04)' : '#fff',
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 0 ? 0.6 : 1
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                aria-label="Next page"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '8px',
                  background: currentPage >= totalPages - 1 ? 'rgba(0,0,0,0.04)' : '#fff',
                  cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage >= totalPages - 1 ? 0.6 : 1
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111', width: '72px' }}>
                    Product
                  </th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111' }}>
                    Order date
                  </th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111' }}>
                    Order ID
                  </th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111' }}>
                    Name
                  </th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#111' }}>
                    State
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <td style={{ padding: '0.4rem 1rem', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.08)',
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }}
                      >
                        <Image
                          src={dashboardProductImages[order.imageIndex % dashboardProductImages.length]}
                          alt=""
                          width={48}
                          height={48}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        {tshirtImageIndices.includes(order.imageIndex) && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '38%',
                              transform: 'translate(-50%, -50%)',
                              width: '14px',
                              height: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Image
                              src="/d1.png"
                              alt=""
                              width={14}
                              height={14}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                        {nonTshirtImageIndices.includes(order.imageIndex) && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '38%',
                              transform: 'translate(-50%, -50%)',
                              width: '14px',
                              height: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Image
                              src="/d2.png"
                              alt=""
                              width={14}
                              height={14}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.45rem 1rem', color: '#111' }}>
                      {order.orderDate}
                    </td>
                    <td style={{ padding: '0.45rem 1rem' }}>
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/order/${order.orderId}`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: '#1d4ed8',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px'
                        }}
                      >
                        {order.orderId}
                      </button>
                    </td>
                    <td style={{ padding: '0.45rem 1rem', color: '#111' }}>
                      {order.name}
                    </td>
                    <td style={{ padding: '0.45rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          ...statusBadgeStyle[order.status]
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.45rem 1rem', color: '#333' }}>
                      {order.state}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
