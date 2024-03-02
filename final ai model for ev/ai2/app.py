from flask import Flask, render_template, request
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)

# Sample charging station data
charging_stations = pd.DataFrame({
    'name': ['Station A', 'Station B', 'Station C'],
    'location': ['Ahmedabad', 'Gandhinagar', 'Rajkot'],
    'connector_types': ['CHAdeMO, CCS', 'Tesla Supercharger', 'CHAdeMO, CCS, Tesla Supercharger'],
    'charging_speed': ['Fast', 'Super Fast', 'Fast'],
    'amenities': ['Cafe, Restroom', 'Restroom', 'Cafe']
})

# Feature engineering: Combine charging station features into a single string
charging_stations['features'] = charging_stations['connector_types'] + ', ' + \
                                  charging_stations['charging_speed'] + ', ' + \
                                  charging_stations['amenities']

# Create TF-IDF vectorizer
tfidf = TfidfVectorizer(stop_words='english')

# Fit-transform charging station features
tfidf_matrix = tfidf.fit_transform(charging_stations['features'])

# Compute similarity scores using cosine similarity
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)


def recommend_charging_stations(user_preferences, cosine_sim):
    """Recommends charging stations based on user preferences and cosine similarity."""

    # Find indices of charging stations similar to user preferences
    idx = charging_stations.index[
        (charging_stations['connector_types'] == user_preferences['connector_types']) &
        (charging_stations['charging_speed'] == user_preferences['charging_speed']) &
        (charging_stations['amenities'] == user_preferences['amenities'])
    ].tolist()

    # Check if any charging stations match user preferences
    if not idx:
        return None  # Return None if no matches are found

    # Get similarity scores for matching stations
    sim_scores = cosine_sim[idx[0]]

    # Sort stations by similarity score (highest to lowest)
    sorted_stations = sorted(zip(idx, sim_scores), key=lambda x: x[1], reverse=True)

    # Recommended stations will be filtered based on battery level and distance (placeholder logic)
    recommended_stations = []
    for station_idx, sim_score in sorted_stations:
        # Placeholder logic - Replace with calculations based on your needs
        recommended_stations.append({
            'name': charging_stations.loc[station_idx]['name'],
            'similarity_score': sim_score
        })

    return recommended_stations


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get user preferences from form
        user_preferences = {
            'connector_types': request.form['connector_types'],
            'charging_speed': request.form['charging_speed'],
            'amenities': request.form['amenities'],
            'battery_level': int(request.form['battery_level'])
        }

        # Recommend charging stations
        recommended_stations = recommend_charging_stations(user_preferences, cosine_sim)

        # Handle the case where no matching stations are found
        if recommended_stations is None:
            message = "No charging stations found matching your preferences."
            return render_template('results.html', message=message)

        return render_template('results.html', recommended_stations=recommended_stations)

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
