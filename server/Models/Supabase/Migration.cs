using System;
using System.Collections.Generic;

namespace server.Models.Supabase;

public partial class Migration
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Hash { get; set; } = null!;

    public DateTime? ExecutedAt { get; set; }
}
