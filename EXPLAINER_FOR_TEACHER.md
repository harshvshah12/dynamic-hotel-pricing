# Lumina RMS: Project Glossary & Explainer Guide

This guide is designed to help you quickly and deeply understand every technical term, abbreviation, and concept used in your Dynamic Hotel Pricing project. You can use this cheat sheet to confidently explain your system to your teachers, examiners, or anyone else.

---

## 1. Hotel & Revenue Management Terms

### **ADR (Average Daily Rate)**
* **What it means:** The average rental income per paid occupied room in a given time period. 
* **How to explain it:** "ADR is simply the price a customer pays for one night in a hotel room. Our entire machine learning model is built to predict the most optimal ADR for any given booking."

### **RevPAR (Revenue Per Available Room)**
* **What it means:** Calculated by multiplying a hotel's ADR by its occupancy rate.
* **How to explain it:** "While ADR just looks at the price of rooms we *actually sold*, RevPAR looks at how much money we are making across *all* our rooms (even the empty ones). If we set our ADR too high and no one books, our RevPAR drops."

### **Lead Time**
* **What it means:** The number of days between when a customer makes a booking and when they actually arrive at the hotel.
* **How to explain it:** "Lead time tells us how far in advance someone booked. A lead time of 0 means a last-minute, same-day booking (which we might charge more for), while a lead time of 150 means an early bird booking."

### **Market Segment / Distribution Channel**
* **What it means:** Where the booking came from (e.g., Online Travel Agencies like Booking.com, Direct from the hotel website, Corporate accounts).
* **How to explain it:** "Different types of customers have different willingness to pay. A corporate guest booking directly might have a different price elasticity compared to a tourist booking through Expedia."

### **Dynamic Pricing / Elasticity**
* **What it means:** Changing the price of a product based on current market demand, supply, and customer behavior.
* **How to explain it:** "Just like Uber surges prices when it rains, our system surges hotel prices when occupancy is high or it's a busy weekend, and drops prices when the hotel is empty to attract more guests."

---

## 2. Machine Learning Metrics (How we measure success)

### **R² (R-Squared) Score**
* **What it means:** A statistical measure representing the proportion of variance for a dependent variable that's explained by an independent variable in a regression model.
* **How to explain it:** "R-Squared measures accuracy on a scale from 0 to 1 (or 0% to 100%). It tells us how well our model explains the changes in price. Our baseline model only had a 15% score, meaning it was basically guessing. Our final ensemble hit 85%, meaning it accurately predicts the actual market price 85% of the time."

### **RMSE (Root Mean Squared Error)**
* **What it means:** The standard deviation of the prediction errors (residuals).
* **How to explain it:** "RMSE tells us exactly how far off our predictions are in actual Euros. If our RMSE is 14.9, it means on average, our AI's predicted price is within ~€15 of the true market price. We want this number to be as low as possible."

### **MAE (Mean Absolute Error)**
* **What it means:** The average absolute difference between the predicted values and the actual values.
* **How to explain it:** "Similar to RMSE, but it treats all errors equally without heavily punishing massive outliers. It tells us the absolute average mistake our model makes per room quote."

### **Data Leakage**
* **What it means:** When information from outside the training dataset is used to create the model, or when future data (that wouldn't be available at prediction time) accidentally leaks into the training phase.
* **How to explain it:** "We had to be very careful to remove fields like 'reservation status' or 'actual checkout date' from our training data. In the real world, when a customer is asking for a price, we don't know if they will cancel in the future. If we trained the AI with that future knowledge, the accuracy would be artificially high and invalid. We ensured zero data leakage."

---

## 3. The Machine Learning Models

### **Regression vs. Classification**
* **What it means:** Classification predicts a category (Cat vs. Dog). Regression predicts a continuous number (Price: €150.25).
* **How to explain it:** "Because we are predicting an exact monetary price (ADR), this is a Regression problem, not a Classification problem."

### **1. Ridge Regression (Our Baseline Model)**
* **What it means:** A simple linear regression model that uses 'L2 Regularization' to prevent any single feature from dominating the prediction.
* **How to explain it:** "We used this as our starting point. It assumes a straight-line relationship between inputs and price. It performed poorly, which proved to us that hotel pricing is highly complex and non-linear, justifying our use of advanced AI."

### **2. Random Forest Regressor**
* **What it means:** An algorithm that builds hundreds of 'Decision Trees' (a forest) and averages their predictions.
* **How to explain it:** "Instead of relying on one decision path, Random Forest creates 150 different decision trees using random subsets of data. When a booking comes in, all 150 trees guess the price, and the model outputs the average. It is excellent at catching complex patterns."

### **3. HistGradientBoosting (Histogram Gradient Boosting)**
* **What it means:** A boosting algorithm that builds trees sequentially, where each new tree tries to correct the errors made by the previous trees.
* **How to explain it:** "Unlike Random Forest which builds trees independently, Gradient Boosting learns from its mistakes. If tree #1 guesses the price too low, tree #2 specifically focuses on fixing that gap. It is incredibly fast and highly accurate."

### **4. Extra Trees Regressor**
* **What it means:** Stands for 'Extremely Randomized Trees'. Similar to Random Forest, but it chooses the split points for the data completely at random.
* **How to explain it:** "By adding pure randomness to how it makes decisions, Extra Trees reduces 'variance' (overfitting). It ensures our model isn't just memorizing the training data, but is actually learning general pricing rules."

### **5. The Ensemble (Stacking & Blending)**
* **What it means:** Combining multiple different AI models into one super-model.
* **How to explain it:** "No single model is perfect. Random Forest might be great at summer bookings, while Gradient Boosting might be better at corporate bookings. Our **Stacking Meta-Regressor** acts as a 'manager'. It looks at the predictions from all 4 base models and dynamically learns which model to trust the most for that specific booking. This is why our accuracy jumped to 85%."

---

## 4. XAI (Explainable AI)

### **Black-Box AI**
* **What it means:** An AI system where the internal decision-making process is hidden from the user. You put data in, get a price out, but have no idea *why*.

### **Feature Importance / Attribution**
* **What it means:** Techniques used to peek inside the black box and see exactly how much weight the AI gave to each input.
* **How to explain it:** "Revenue managers won't trust an AI that just spits out '€150' without explanation. We implemented Explainable AI (XAI) so the system can say: 'The base price is €100. I added €30 because it's a weekend, and added €20 because the lead time is very short.' It provides mathematical transparency."

---

## 5. Technical Stack

### **FastAPI (Backend)**
* **How to explain it:** "The engine room of our project. It's a modern Python framework that holds our trained Machine Learning models in memory. When the frontend asks for a price, FastAPI runs the data through our Ensemble AI and returns the price in less than 50 milliseconds."

### **React / Vite (Frontend)**
* **How to explain it:** "The user interface. We built it with React to ensure it is highly interactive. Features like the 'Scenario Simulator' allow managers to drag sliders and see the AI recalculate prices instantly without reloading the page."
