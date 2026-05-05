using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WorkHub.Models;

public partial class TaskContext : DbContext
{
    public TaskContext()
    {
    }

    public TaskContext(DbContextOptions<TaskContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Labels> Labels { get; set; }
    public virtual DbSet<Notification> Notifications { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<Skill> Skills { get; set; }
    public virtual DbSet<SubTask> SubTasks { get; set; }
    public virtual DbSet<Task> Tasks { get; set; }
    public virtual DbSet<TaskLabel> TaskLabels {  get; set; }
    public virtual DbSet<TaskComment> TaskComments { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserSkill> UserSkills { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Server=KRUSHIL\\SQLEXPRESS01;Database=Task_Management;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ---------------- LABELS ----------------
        modelBuilder.Entity<Labels>(entity =>
        {
            entity.HasKey(e => e.LabelId).HasName("PK__Labels__397E2BC3FA667A26");
            entity.HasIndex(e => e.LabelName).IsUnique();
        });

        // ---------------- TASK ↔ LABEL (MANY-TO-MANY) ----------------
        modelBuilder.Entity<TaskLabel>(entity =>
        {
            entity.HasKey(x => new { x.TaskId, x.LabelId });

            entity.HasOne(tl => tl.Task)
                .WithMany(t => t.TaskLabels)
                .HasForeignKey(tl => tl.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(tl => tl.Label)
                .WithMany(l => l.TaskLabels)
                .HasForeignKey(tl => tl.LabelId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------------- NOTIFICATION ----------------
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E124D039885");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);

            //entity.HasOne(d => d.User).WithMany(p => p.Notifications).HasConstraintName("FK__Notificat__UserI__797309D9");
            entity.HasOne(d => d.User)
                  .WithMany(p => p.Notifications)
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        // ---------------- ROLE ----------------

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A6F28FA55");
        });

        // ---------------- SKILL ----------------
        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__Skills__DFA09187FA5FE800");
        });

        // ---------------- SUB TASK ----------------
        modelBuilder.Entity<SubTask>(entity =>
        {
            entity.HasKey(e => e.SubTaskId).HasName("PK__SubTasks__869FF182768AA8B4");

            entity.Property(e => e.IsCompleted).HasDefaultValue(false);

            //entity.HasOne(d => d.Task).WithMany(p => p.SubTasks).HasConstraintName("FK__SubTasks__TaskId__6A30C649");
            entity.HasOne(d => d.Task)
                  .WithMany(p => p.SubTasks)
                  .HasForeignKey(d => d.TaskId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------------- TASK ----------------
        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.TaskId);

            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AssignedToNavigation)
                  .WithMany(p => p.TaskAssignedToNavigations)
                  .HasForeignKey(d => d.AssignedTo)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.CreatedByNavigation)
                  .WithMany(p => p.TaskCreatedByNavigations)
                  .HasForeignKey(d => d.CreatedBy)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        //modelBuilder.Entity<Task>(entity =>
        //{
        //    entity.HasKey(e => e.TaskId).HasName("PK__Tasks__7C6949B1418F8B88");

        //    entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

        //    entity.HasOne(d => d.AssignedToNavigation).WithMany(p => p.TaskAssignedToNavigations).HasConstraintName("FK__Tasks__AssignedT__66603565");

        //    entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TaskCreatedByNavigations).HasConstraintName("FK__Tasks__CreatedBy__656C112C");

        //entity.HasMany(d => d.Labels).WithMany(p => p.Tasks)
        //    .UsingEntity<Dictionary<string, object>>(
        //        "TaskLabel",
        //        r => r.HasOne<Labels>().WithMany()
        //            .HasForeignKey("LabelId")
        //            .OnDelete(DeleteBehavior.ClientSetNull)
        //            .HasConstraintName("FK__TaskLabel__Label__74AE54BC"),
        //        l => l.HasOne<Task>().WithMany()
        //            .HasForeignKey("TaskId")
        //            .OnDelete(DeleteBehavior.ClientSetNull)
        //            .HasConstraintName("FK__TaskLabel__TaskI__73BA3083"),
        //        j =>
        //        {
        //            j.HasKey("TaskId", "LabelId").HasName("PK__TaskLabe__5FFEAB0D2EB1D694");
        //            j.ToTable("TaskLabels");
        //        });
        //});

        // ---------------- TASK COMMENT ----------------

        modelBuilder.Entity<TaskComment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__TaskComm__C3B4DFCAE3FCF602");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            //entity.HasOne(d => d.Task).WithMany(p => p.TaskComments).HasConstraintName("FK__TaskComme__TaskI__6E01572D");
            //entity.HasOne(d => d.User).WithMany(p => p.TaskComments).HasConstraintName("FK__TaskComme__UserI__6EF57B66");

            entity.HasOne(d => d.Task)
                  .WithMany(p => p.TaskComments)
                  .HasForeignKey(d => d.TaskId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.User)
                  .WithMany(p => p.TaskComments)
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------------- USER ----------------
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C99AD4585");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            //entity.HasOne(d => d.Role).WithMany(p => p.Users).HasConstraintName("FK__Users__RoleId__5FB337D6");
            entity.HasOne(d => d.Role)
                 .WithMany(p => p.Users)
                 .HasForeignKey(d => d.RoleId)
                 .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------------- USER SKILL (MANY-TO-MANY) ----------------

        modelBuilder.Entity<UserSkill>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.SkillId }).HasName("PK__UserSkil__7A72C55451EE81F2");

            entity.HasOne(d => d.Skill).WithMany(p => p.UserSkills)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSkill__Skill__7F2BE32F");

            entity.HasOne(d => d.User).WithMany(p => p.UserSkills)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSkill__UserI__7E37BEF6");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
