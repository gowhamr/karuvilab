import re

# 1. Update CalendarHeader.tsx
with open('src/features/calendar/components/CalendarHeader.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const handleToday = () => setCurrentDate(new Date());",
    "const handleToday = () => {\n    setCurrentDate(new Date());\n    window.dispatchEvent(new CustomEvent('calendar-today-clicked'));\n  };"
)

content = content.replace(
    '<span className="sm:hidden">Add</span>',
    '<span className="sm:hidden">New Event</span>'
)

with open('src/features/calendar/components/CalendarHeader.tsx', 'w') as f:
    f.write(content)


# 2. Update MonthView.tsx
with open('src/features/calendar/components/MonthView.tsx', 'r') as f:
    content = f.read()

# Add framer-motion and useRef
content = content.replace(
    'import { useState } from "react";',
    'import { useState, useRef, useEffect } from "react";\nimport { m, AnimatePresence } from "framer-motion";'
)

# Update MonthView component body
month_view_old = """  const days = getMonthDays(currentDate);
  const monthStart = startOfMonth(currentDate);

  const handleDayClick = (day: Date) => {"""

month_view_new = """  const days = getMonthDays(currentDate);
  const monthStart = startOfMonth(currentDate);
  
  const prevMonthRef = useRef(monthStart.getTime());
  const direction = monthStart.getTime() > prevMonthRef.current ? 1 : monthStart.getTime() < prevMonthRef.current ? -1 : 0;
  
  useEffect(() => {
    prevMonthRef.current = monthStart.getTime();
  }, [monthStart]);

  useEffect(() => {
    const handleTodayClicked = () => {
      setTimeout(() => {
        const todayEl = document.querySelector('[data-is-today="true"]');
        if (todayEl) {
          todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          todayEl.classList.add('bg-blue/10');
          setTimeout(() => todayEl.classList.remove('bg-blue/10'), 1500);
        }
      }, 100);
    };
    window.addEventListener('calendar-today-clicked', handleTodayClicked);
    return () => window.removeEventListener('calendar-today-clicked', handleTodayClicked);
  }, []);

  const handleDayClick = (day: Date) => {"""

content = content.replace(month_view_old, month_view_new)

# Wrap grid in AnimatePresence
grid_old = """          {/* Grid */}
          <div className="grid grid-cols-7 flex-1">
            {days.map((day) => (
              <DayCell 
                key={day.toISOString()} 
                day={day} 
                isCurrentMonth={isSameMonth(day, monthStart)}
                onClick={() => handleDayClick(day)}
                onAddEvent={onAddEvent}
              />
            ))}
          </div>"""

grid_new = """          {/* Grid */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <m.div
                key={monthStart.toISOString()}
                custom={direction}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-7 absolute inset-0"
              >
                {days.map((day) => (
                  <DayCell 
                    key={day.toISOString()} 
                    day={day} 
                    isCurrentMonth={isSameMonth(day, monthStart)}
                    isSelected={currentDate ? isSameDay(day, currentDate) : false}
                    onClick={() => {
                      // On click, also set current date so it acts as selected
                      useCalendarStore.getState().setCurrentDate(day);
                      handleDayClick(day);
                    }}
                    onAddEvent={onAddEvent}
                  />
                ))}
              </m.div>
            </AnimatePresence>
          </div>"""

content = content.replace(grid_old, grid_new)

# Update DayCell signature
content = content.replace(
    'function DayCell({ day, isCurrentMonth, onClick, onAddEvent }: { day: Date, isCurrentMonth: boolean, onClick: () => void, onAddEvent: (date: Date) => void }) {',
    'function DayCell({ day, isCurrentMonth, isSelected, onClick, onAddEvent }: { day: Date, isCurrentMonth: boolean, isSelected: boolean, onClick: () => void, onAddEvent: (date: Date) => void }) {'
)

# Update DayCell wrapper classes
daycell_wrapper_old = """      className={cn(
        "min-h-[72px] md:min-h-36 p-1 md:p-2 border-r border-b border-border/20 last:border-r-0 relative group cursor-pointer transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset",
        !isCurrentMonth && "bg-bg/20 opacity-40",
        isCurrentMonth && "hover:bg-indigo-500/5",
        isToday && "bg-indigo-500/[0.05]"
      )}"""

daycell_wrapper_new = """      data-is-today={isToday}
      className={cn(
        "min-h-[72px] md:min-h-36 p-1 md:p-2 border-r border-b border-border/20 last:border-r-0 relative group cursor-pointer transition-all duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset overflow-hidden",
        !isCurrentMonth && "bg-bg/20 opacity-40",
        isCurrentMonth && "hover:bg-bg"
      )}"""

content = content.replace(daycell_wrapper_old, daycell_wrapper_new)

# Update DayCell Number highlight
number_old = """          <span className={cn(
            "w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full md:rounded-xl text-sm font-black transition-all",
            isToday ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" : "text-text-2 group-hover:bg-surface"
          )}>
            {format(day, 'd')}
          </span>"""

number_new = """          <div className="flex items-center gap-1.5">
            <span className={cn(
              "w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full md:rounded-xl text-sm font-black transition-all duration-150",
              isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105" : 
              isToday ? "border-2 border-blue text-blue" : "text-text-2 group-hover:bg-surface"
            )}>
              {format(day, 'd')}
            </span>
            {isToday && <span className="text-[9px] font-black uppercase tracking-widest text-blue hidden md:inline">Today</span>}
          </div>"""

content = content.replace(number_old, number_new)

# Update DayCell top-right world event dots
top_right_dots_old = """          <div className="flex gap-1 items-center">
            {sortedWorldEvents.slice(0, 3).map((evt) => (
              <div key={evt.id} title={evt.name}>
                <span className="hidden md:inline text-xs">{evt.emoji}</span>
                <div className={cn("w-1.5 h-1.5 rounded-full md:hidden", evt.colors.bg)} />
              </div>
            ))}
          </div>"""

top_right_dots_new = """          <div className="flex gap-1 items-center">
            {sortedWorldEvents.slice(0, 3).map((evt) => (
              <div key={evt.id} title={evt.name}>
                <span className="text-[11px] md:text-xs">{evt.emoji}</span>
              </div>
            ))}
          </div>"""

content = content.replace(top_right_dots_old, top_right_dots_new)

# Update personal events dots (replace the whole flex-wrap block)
personal_events_old = """        {/* Personal Events */}
        <div className="flex flex-wrap gap-1 md:block md:space-y-1">
          {dayEvents.slice(0, 3).map(event => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event.id);
                onAddEvent(day);
              }}
              className={cn(
                "md:px-2 md:py-1 rounded-full md:rounded-lg text-tiny font-bold truncate border shadow-sm",
                "w-1.5 h-1.5 md:w-auto md:h-auto",
                COLOR_MAP[event.color].bg,
                COLOR_MAP[event.color].border,
                COLOR_MAP[event.color].text
              )}
            >
              <span className="hidden md:inline">{event.title}</span>
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-tiny md:text-micro font-black text-text-4 uppercase tracking-widest">
              <span className="md:hidden">+{dayEvents.length - 3}</span>
              <span className="hidden md:inline">+ {dayEvents.length - 3} more</span>
            </div>
          )}
        </div>"""

personal_events_new = """        {/* Personal Events */}
        <div className="flex flex-col gap-1">
          {dayEvents.slice(0, 3).map(event => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event.id);
                onAddEvent(day);
              }}
              className={cn(
                "hidden md:block px-2 py-1 rounded-lg text-tiny font-bold truncate border shadow-sm transition-transform hover:scale-[1.02]",
                COLOR_MAP[event.color].bg,
                COLOR_MAP[event.color].border,
                COLOR_MAP[event.color].text
              )}
            >
              <span>{event.title}</span>
            </div>
          ))}
          
          {/* Mobile dots for personal events */}
          <div className="flex flex-wrap gap-1 md:hidden">
            {dayEvents.slice(0, 3).map(event => (
              <div 
                key={event.id}
                className={cn("w-2 h-2 rounded-full", COLOR_MAP[event.color].bg)}
              />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[9px] font-black text-text-4 leading-none">+{dayEvents.length - 3}</span>
            )}
          </div>
          
          <div className="hidden md:block">
            {dayEvents.length > 3 && (
              <div className="text-micro font-black text-text-4 uppercase tracking-widest pl-1">
                + {dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>"""

content = content.replace(personal_events_old, personal_events_new)

with open('src/features/calendar/components/MonthView.tsx', 'w') as f:
    f.write(content)


# 3. Update CalendarSidebar.tsx
with open('src/features/calendar/components/CalendarSidebar.tsx', 'r') as f:
    sidebar_content = f.read()
    
# Update upcoming events to show weekday
upcoming_old = """                  <p className="text-xs font-bold text-text-4">
                    {format(date, 'MMM d')} ·{' '}
                    {daysUntil === 0 ? 'Today' :
                     daysUntil === 1 ? 'Tomorrow' :
                     `In ${daysUntil} days`}
                  </p>"""

upcoming_new = """                  <p className="text-[11px] font-bold text-text-4">
                    {format(date, 'EEE, MMM d')} ·{' '}
                    {daysUntil === 0 ? 'Today' :
                     daysUntil === 1 ? 'Tomorrow' :
                     `In ${daysUntil} days`}
                  </p>"""

sidebar_content = sidebar_content.replace(upcoming_old, upcoming_new)

# Update filters to be collapsible and have Select All / Clear All
filters_old = """            {/* Categories checkbox list */}
            <div className="space-y-2.5 border-t border-border/20 pt-4">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-500/80" />
                Categories
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1 no-scrollbar">
                {CATEGORY_INFOS.map((cat) => {"""

filters_new = """            {/* Categories checkbox list */}
            <div className="border-t border-border/20 pt-4">
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none">
                  <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-1.5 cursor-pointer">
                    <Filter className="w-3.5 h-3.5 text-indigo-500/80" />
                    Categories <span className="text-[10px] text-text-muted bg-surface-2 px-1.5 py-0.5 rounded-md">{showCategories.length} selected</span>
                  </label>
                  <ChevronDown className="w-4 h-4 text-text-4 group-open:rotate-180 transition-transform" />
                </summary>
                
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => updateWorldEventsSettings({ showCategories: CATEGORY_INFOS.map(c => c.id) })}
                      className="flex-1 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-xs font-bold text-text-3 transition-colors"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={() => updateWorldEventsSettings({ showCategories: [] })}
                      className="flex-1 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-xs font-bold text-text-3 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar pb-2">
                    {CATEGORY_INFOS.map((cat) => {"""

sidebar_content = sidebar_content.replace(filters_old, filters_new)
sidebar_content = sidebar_content.replace(
    'import { Globe, Settings, Filter, Check, Eye, EyeOff } from "lucide-react";',
    'import { Globe, Settings, Filter, Check, Eye, EyeOff, ChevronDown } from "lucide-react";'
)

# Fix missing closing tags for details
filters_end_old = """                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}"""

filters_end_new = """                      </button>
                    );
                  })}
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}"""

sidebar_content = sidebar_content.replace(filters_end_old, filters_end_new)


with open('src/features/calendar/components/CalendarSidebar.tsx', 'w') as f:
    f.write(sidebar_content)

print("Calendar scripts updated!")
