import os
import re
import difflib
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

GENIUS_ACCESS_TOKEN = os.environ.get("GENIUS_ACCESS_TOKEN", "sAWDRcLoyADTZQ5YDYJ5v0d_WnRTEmModoA8SWaFBeE9oi6tapmLsf_I-Hi2pfgv")

GENIUS_SEARCH_URL = "https://api.genius.com/search"


def clean_text(text):
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def similarity(a, b):
    return difflib.SequenceMatcher(None, clean_text(a), clean_text(b)).ratio()


@app.route("/api/search")
def search():
    query = request.args.get("q", "").strip()
    if len(query) < 2:
        return jsonify({"error": "query_too_short"}), 400

    if GENIUS_ACCESS_TOKEN == "":
        return jsonify({"error": "missing_api_key"}), 500

    headers = {"Authorization": f"Bearer {GENIUS_ACCESS_TOKEN}"}

    try:
        resp = requests.get(
            GENIUS_SEARCH_URL,
            headers=headers,
            params={"q": query},
            timeout=8,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        return jsonify({"error": "genius_request_failed", "detail": str(exc)}), 502

    data = resp.json()
    hits = data.get("response", {}).get("hits", [])

    results = []
    for hit in hits:
        song = hit.get("result", {})
        title = song.get("title", "")
        artist = song.get("primary_artist", {}).get("name", "")
        thumbnail = song.get("song_art_image_thumbnail_url", "")
        url = song.get("url", "")
        combined = f"{title} {artist}"
        score = similarity(query, combined)
        results.append(
            {
                "title": title,
                "artist": artist,
                "thumbnail": thumbnail,
                "url": url,
                "score": round(score, 3),
            }
        )

    results = results[:5]

    return jsonify({"query": query, "results": results})


if __name__ == "__main__":
    app.run(debug=True, port=5000)