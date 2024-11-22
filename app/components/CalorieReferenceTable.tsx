// src/components/CalorieReferenceTable.tsx

import React from "react";
import "./calorie_reference_table.css";
const CalorieReferenceTable: React.FC = () => {
  return (
    <div className="calorie-reference-table-container">
      <h2 id="tablename">Common Foods Calorie Reference</h2>
      <table className="calorie-reference-table">
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Unit</th>
            <th>Calories per Unit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple (medium)</td>
            <td>1 medium</td>
            <td>95 kcal</td>
          </tr>
          <tr>
            <td>Banana (medium)</td>
            <td>1 medium</td>
            <td>105 kcal</td>
          </tr>
          <tr>
            <td>Carrot (raw)</td>
            <td>1 medium</td>
            <td>25 kcal</td>
          </tr>
          <tr>
            <td>Chicken Breast (cooked)</td>
            <td>100 g</td>
            <td>165 kcal</td>
          </tr>
          <tr>
            <td>Egg (large)</td>
            <td>1 large</td>
            <td>70 kcal</td>
          </tr>
          <tr>
            <td>Rice (cooked)</td>
            <td>1 cup (158g)</td>
            <td>205 kcal</td>
          </tr>
          <tr>
            <td>Bread (whole wheat)</td>
            <td>1 slice</td>
            <td>80 kcal</td>
          </tr>
          <tr>
            <td>Bread (white)</td>
            <td>1 slice</td>
            <td>70 kcal</td>
          </tr>
          <tr>
            <td>Cheese (cheddar)</td>
            <td>1 slice (28g)</td>
            <td>113 kcal</td>
          </tr>
          <tr>
            <td>Milk (whole)</td>
            <td>1 cup (240ml)</td>
            <td>150 kcal</td>
          </tr>
          <tr>
            <td>Yogurt (plain, whole)</td>
            <td>1 cup (245g)</td>
            <td>150 kcal</td>
          </tr>
          <tr>
            <td>Almonds</td>
            <td>1 oz (28g)</td>
            <td>160 kcal</td>
          </tr>
          <tr>
            <td>Peanut Butter</td>
            <td>1 tbsp (16g)</td>
            <td>94 kcal</td>
          </tr>
          <tr>
            <td>Olive Oil</td>
            <td>1 tbsp (14g)</td>
            <td>119 kcal</td>
          </tr>
          <tr>
            <td>Salmon (cooked)</td>
            <td>100 g</td>
            <td>206 kcal</td>
          </tr>
          <tr>
            <td>Spinach (cooked)</td>
            <td>1 cup (180g)</td>
            <td>41 kcal</td>
          </tr>
          <tr>
            <td>Avocado</td>
            <td>1 medium</td>
            <td>240 kcal</td>
          </tr>
          <tr>
            <td>Cucumber (raw)</td>
            <td>1 medium</td>
            <td>16 kcal</td>
          </tr>
          <tr>
            <td>Tomato (raw)</td>
            <td>1 medium</td>
            <td>22 kcal</td>
          </tr>
          <tr>
            <td>Orange</td>
            <td>1 medium</td>
            <td>62 kcal</td>
          </tr>
          <tr>
            <td>Grapes</td>
            <td>1 cup (150g)</td>
            <td>104 kcal</td>
          </tr>
          <tr>
            <td>Potato (baked)</td>
            <td>1 medium (150g)</td>
            <td>130 kcal</td>
          </tr>
          <tr>
            <td>Pasta (cooked)</td>
            <td>1 cup (200g)</td>
            <td>220 kcal</td>
          </tr>
          <tr>
            <td>French Fries</td>
            <td>1 medium serving (117g)</td>
            <td>365 kcal</td>
          </tr>
          <tr>
            <td>Ice Cream</td>
            <td>1 scoop (½ cup)</td>
            <td>137 kcal</td>
          </tr>
          <tr>
            <td>Popcorn (air-popped)</td>
            <td>1 cup (8g)</td>
            <td>31 kcal</td>
          </tr>
          <tr>
            <td>Cereal (Cornflakes)</td>
            <td>1 cup (30g)</td>
            <td>120 kcal</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CalorieReferenceTable;
