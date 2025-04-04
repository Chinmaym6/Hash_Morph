from apscheduler.schedulers.blocking import BlockingScheduler
from database import refresh_employee_statuses

if __name__ == "__main__":
    scheduler = BlockingScheduler()
    # Schedule the refresh to run every day at midnight.
    scheduler.add_job(refresh_employee_statuses, 'cron', hour=0)
    print("Scheduler started. Employee statuses will refresh daily at midnight.")
    scheduler.start()
