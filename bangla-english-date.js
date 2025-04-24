// বাংলা মাসের নাম
        const banglaMonths = [
            'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 
            'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 
            'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
        ];

        // বাংলা সপ্তাহের দিন
        const banglaWeekDays = [
            'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 
            'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
        ];

        // ইংরেজি মাসের বাংলা নাম
        const englishMonthsBangla = [
            'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 
            'মে', 'জুন', 'জুলাই', 'আগস্ট', 
            'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
        ];

        // ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
        function enToBnNumber(number) {
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return number.toString().replace(/\d/g, digit => bnDigits[digit]);
        }

        // ইংরেজি থেকে বাংলা তারিখ কনভার্টার
        function getBanglaDate(englishDate) {
            const date = new Date(englishDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            
            // গ্রেগরিয়ান থেকে বাংলা তারিখ কনভার্শন (সরলীকৃত)
            let banglaYear = year - 593;
            if (month < 4 || (month === 4 && day < 14)) {
                banglaYear--;
            }
            
            let banglaMonth = ((month + 8) % 12) + 1;
            let banglaDay = day - 13;
            
            if (banglaDay < 1) {
                banglaMonth--;
                if (banglaMonth < 1) {
                    banglaMonth = 12;
                }
                const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
                banglaDay += daysInPrevMonth;
            }
            
            return {
                day: banglaDay,
                month: banglaMonth,
                monthName: banglaMonths[banglaMonth - 1],
                year: banglaYear,
                weekDay: banglaWeekDays[date.getDay()]
            };
        }

        // তারিখ আপডেট ফাংশন
        function updateDates() {
            const now = new Date();
            
            // বাংলা তারিখ
            const banglaDate = getBanglaDate(now);
            const banglaDateStr = `${enToBnNumber(banglaDate.day)} ${banglaDate.monthName} ${enToBnNumber(banglaDate.year)} বঙ্গাব্দ`;
            document.getElementById('banglaDate').textContent = banglaDateStr;
            
            // ইংরেজি তারিখ
            const englishDateStr = `${banglaWeekDays[now.getDay()]}, ${enToBnNumber(now.getDate())} ${englishMonthsBangla[now.getMonth()]} ${enToBnNumber(now.getFullYear())} খ্রিস্টাব্দ`;
            document.getElementById('englishDate').textContent = englishDateStr;
        }

        // পেজ লোড হলে তারিখ আপডেট করুন
        updateDates();
        
        // প্রতিদিন তারিখ আপডেট করার জন্য (ঐচ্ছিক)
        setInterval(updateDates, 86400000); // 24 ঘন্টা পর পর আপডেট
