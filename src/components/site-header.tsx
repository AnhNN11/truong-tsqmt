'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, Search, X } from 'lucide-react';
import type { Settings } from '@/lib/types';
import styles from './site-header.module.css';

const navigation = [
  ['/', 'Trang chủ'],
  ['/gioi-thieu', 'Giới thiệu'],
  ['/giao-duc', 'Giáo dục & rèn luyện'],
  ['/tin-tuc', 'Tin tức & sự kiện'],
];

export function SiteHeader({ settings }: { settings: Settings }) {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    function closeOnOutsideClick(event: PointerEvent) {
      if (!searchContainer.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [searchOpen]);

  function closeNavigation() {
    setMenuOpen(false);
    setSearchOpen(false);
  }

  return (
    <header
      className={styles.header}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        if (searchOpen) {
          setSearchOpen(false);
          searchButton.current?.focus();
        } else if (menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className={`${styles.container} ${styles.masthead}`}>
        <Link href="/" className={styles.brand} onClick={closeNavigation}>
          <img
            className={styles.logo}
            src="/images/school-logo.jpg"
            alt="Logo Phân hiệu 1"
            width={72}
            height={72}
          />
          <span className={styles.identity}>
            <span className={styles.branch}>{settings.branch}</span>
            <strong className={styles.schoolName}>{settings.schoolName}</strong>
            <span className={styles.mobileTagline}>{settings.tagline}</span>
          </span>
        </Link>

        <div className={styles.motto}>
          <span>Kỷ cương · Tình thương · Trách nhiệm</span>
          <span>{settings.tagline}</span>
        </div>

        <button
          ref={menuButton}
          type="button"
          className={`${styles.iconButton} ${styles.menuToggle}`}
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          aria-controls="school-navigation"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setSearchOpen(false);
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="school-navigation"
        className={`${styles.navigationWrap} ${menuOpen ? styles.navigationOpen : ''}`}
      >
        <div className={`${styles.container} ${styles.navigationRow}`}>
          <nav className={styles.navigation} aria-label="Điều hướng chính">
            {navigation.map(([href, label]) => {
              const active = href === '/' ? path === '/' : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.navLink} ${active ? styles.active : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeNavigation}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <Link className={styles.contactLink} href="/#lien-he" onClick={closeNavigation}>
              Liên hệ nhà trường <ArrowUpRight size={16} />
            </Link>
            <div
              ref={searchContainer}
              className={styles.searchContainer}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setSearchOpen(false);
                }
              }}
            >
              <button
                ref={searchButton}
                type="button"
                className={`${styles.iconButton} ${searchOpen ? styles.searchActive : ''}`}
                aria-label="Tìm kiếm"
                aria-expanded={searchOpen}
                aria-controls="school-search"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={19} />
              </button>

              {searchOpen && (
                <form id="school-search" action="/tin-tuc" role="search" className={styles.searchPopover}>
                  <div className={styles.searchHeading}>
                    <label htmlFor="school-search-query">Tìm kiếm</label>
                    <button
                      type="button"
                      className={styles.searchClose}
                      aria-label="Đóng tìm kiếm"
                      onClick={() => {
                        setSearchOpen(false);
                        searchButton.current?.focus();
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className={styles.searchField}>
                    <input
                      autoFocus
                      id="school-search-query"
                      name="q"
                      placeholder="Nhập từ khóa…"
                      type="search"
                    />
                    <button type="submit" aria-label="Tìm kiếm bài viết">
                      <ArrowRight size={19} />
                    </button>
                  </div>
                  <Link href="/tin-tuc" className={styles.searchAll} onClick={closeNavigation}>
                    Xem tất cả tin tức <ArrowUpRight size={14} />
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

