# שאילתה חכמה יותר שמסדרת את הנתונים לפי לוגיקה של משחק
        query = """
            SELECT EventId, DER_mass_vis, DER_pt_h, Label 
            FROM events 
            WHERE 
                (Label = 's' AND DER_mass_vis BETWEEN 122 AND 128) -- סיגנל רק סביב השיא
                OR 
                (Label = 'b' AND (DER_mass_vis < 120 OR DER_mass_vis > 130)) -- רקע רק רחוק מהשיא
            ORDER BY RANDOM() 
            LIMIT 1
        """