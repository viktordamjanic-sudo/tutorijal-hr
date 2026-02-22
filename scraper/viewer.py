import streamlit as st
import sqlite3
import pandas as pd
from datetime import datetime

st.title("📰 NOVINA Scraper - Database Viewer")

conn = sqlite3.connect("headlines.db", check_same_thread=False)

# Stats
st.subheader("📊 Statistics")
stats_df = pd.read_sql_query(
    "SELECT portal, COUNT(*) as count, MAX(scraped_at) as last_scrape FROM headlines GROUP BY portal",
    conn
)
st.dataframe(stats_df, use_container_width=True)

# Filter by portal
st.subheader("🔍 Filter")
col1, col2 = st.columns(2)
with col1:
    portal_filter = st.selectbox("Portal:", ["All", "jutarnji", "vecernji"])
with col2:
    sort_by = st.selectbox("Sort by:", ["scraped_at DESC (newest first)", "scraped_at ASC (oldest first)", "id DESC"])

# Build query
query = "SELECT * FROM headlines"
if portal_filter != "All":
    query += f" WHERE portal = '{portal_filter}'"

if "scraped_at DESC" in sort_by:
    query += " ORDER BY scraped_at DESC"
elif "scraped_at ASC" in sort_by:
    query += " ORDER BY scraped_at ASC"
else:
    query += " ORDER BY id DESC"

query += " LIMIT 1000"

df = pd.read_sql_query(query, conn)

# Show headlines
st.subheader(f"📰 Headlines ({len(df)} showing)")

# Format the dataframe for display
display_df = df[['id', 'portal', 'title', 'author', 'published_at', 'scraped_at', 'url']].copy()
display_df['author'] = display_df['author'].fillna('')
display_df['published_at'] = display_df['published_at'].fillna('')

st.dataframe(display_df, use_container_width=True, hide_index=True)

# Article content viewer
st.subheader("📄 View Article Content")
selected_article = st.selectbox(
    "Select article to view:",
    df.apply(lambda x: f"{x['id']}: {x['title'][:60]}... ({x['portal']})", axis=1).tolist()
)

if selected_article:
    article_id = int(selected_article.split(':')[0])
    article = df[df['id'] == article_id].iloc[0]
    
    with st.expander(f"Show content for: {article['title'][:80]}...", expanded=True):
        st.markdown(f"**Title:** {article['title']}")
        st.markdown(f"**Author:** {article['author'] if article['author'] else 'N/A'}")
        st.markdown(f"**Published:** {article['published_at'] if article['published_at'] else 'N/A'}")
        st.markdown(f"**URL:** [{article['url'][:60]}...]({article['url']})")
        st.markdown("---")
        
        content = article['description'] if pd.notna(article['description']) else ""
        if content:
            st.markdown(f"**Content length:** {len(content)} characters")
            st.text_area("Content:", value=content[:5000] + ("..." if len(content) > 5000 else ""), height=300)
        else:
            st.info("No content available")

# Unsent headlines
unsent_df = df[df["sent_to_api"] == 0]
if len(unsent_df) > 0:
    st.subheader(f"📤 Unsent to API ({len(unsent_df)})")
    st.dataframe(unsent_df[['id', 'portal', 'title', 'scraped_at']], use_container_width=True, hide_index=True)

# Schema
with st.expander("📋 Database Schema"):
    schema = pd.read_sql_query("PRAGMA table_info(headlines);", conn)
    st.dataframe(schema, hide_index=True)

# Scrape State
with st.expander("🔄 Scrape State (Incremental Tracking)"):
    state_df = pd.read_sql_query("SELECT * FROM scrape_state ORDER BY scraped_at DESC", conn)
    if len(state_df) > 0:
        st.dataframe(state_df, hide_index=True)
    else:
        st.info("No scrape state recorded yet. Run the scraper first.")

conn.close()
