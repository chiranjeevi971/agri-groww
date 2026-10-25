import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(CURRENT_DIR, "..", "data", "crop_recommendation.csv")
MODEL_PATH = os.path.join(CURRENT_DIR, "crop_model.joblib")

def train_crop_model():
    print(f"Loading dataset from: {DATA_PATH}")
    if not os.path.exists(DATA_PATH):
        # Run preparation script if dataset missing
        import sys
        sys.path.append(os.path.join(CURRENT_DIR, "..", "data"))
        import prepare_data
        prepare_data.setup_dataset()

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset Shape: {df.shape}")
    print(f"Available Crops ({df['label'].nunique()}): {list(df['label'].unique())}")

    X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training Random Forest Classifier on Agronomic Features...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=16,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    cv_scores = cross_val_score(clf, X, y, cv=5)

    print(f"==================================================")
    print(f"Test Set Accuracy: {acc * 100:.2f}%")
    print(f"5-Fold Cross-Validation: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    print(f"==================================================")

    # Save model pipeline and metadata
    package = {
        "model": clf,
        "features": list(X.columns),
        "classes": list(clf.classes_),
        "accuracy": float(acc)
    }
    joblib.dump(package, MODEL_PATH)
    print(f"Model successfully saved to: {MODEL_PATH}")
    return acc

if __name__ == "__main__":
    train_crop_model()
