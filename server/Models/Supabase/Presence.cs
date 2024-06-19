using System;
using System.Collections.Generic;

namespace server.Models.Supabase;

public partial class Presence
{
    public long Id { get; set; }

    public long ChannelId { get; set; }

    public DateTime InsertedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Channel Channel { get; set; } = null!;
}
