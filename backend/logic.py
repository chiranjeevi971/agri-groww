from datetime import timedelta, date
import models

# Static knowledge base (simulating our crop data)
CROP_SCHEDULES = {
    "Rice": {
        "organic": [
            {"day_offset": 5, "type": "irrigation", "desc": "Initial field flooding (2 inches)."},
            {"day_offset": 10, "type": "fertilizer", "desc": "Apply organic compost/manure."},
            {"day_offset": 25, "type": "weeding", "desc": "First manual weeding."},
            {"day_offset": 60, "type": "disease_inspection", "desc": "Check for stem borer or blast disease."},
        ],
        "conventional": [
            {"day_offset": 5, "type": "irrigation", "desc": "Initial field flooding (2 inches)."},
            {"day_offset": 15, "type": "fertilizer", "desc": "Apply NPK fertilizer (Urea)."},
            {"day_offset": 20, "type": "weeding", "desc": "Apply chemical herbicide."},
            {"day_offset": 60, "type": "disease_inspection", "desc": "Preventative fungicide spray."},
        ]
    },
    "Wheat": {
        "organic": [
            {"day_offset": 1, "type": "irrigation", "desc": "First watering after sowing."},
            {"day_offset": 21, "type": "irrigation", "desc": "Crown root initiation stage - crucial watering."},
            {"day_offset": 30, "type": "weeding", "desc": "Manual weeding."},
        ],
        "conventional": [
            {"day_offset": 1, "type": "irrigation", "desc": "First watering after sowing."},
            {"day_offset": 21, "type": "fertilizer", "desc": "Apply Nitrogen top dressing."},
            {"day_offset": 35, "type": "weeding", "desc": "Herbicide application."},
        ]
    }
}

def generate_schedule(db, crop: models.Crop):
    plant_date = crop.plant_date
    schedule_data = CROP_SCHEDULES.get(crop.name, {}).get(crop.farming_method.lower(), [])
    
    tasks = []
    for item in schedule_data:
        task_date = plant_date + timedelta(days=item["day_offset"])
        
        new_task = models.Task(
            task_type=item["type"],
            description=item["desc"],
            scheduled_date=task_date,
            is_completed=False,
            crop_id=crop.id
        )
        db.add(new_task)
        tasks.append(new_task)
    
    db.commit()
    return tasks
