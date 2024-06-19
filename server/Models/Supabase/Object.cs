using System;
using System.Collections.Generic;

namespace server.Models.Supabase;

public partial class Object
{
    public Guid Id { get; set; }

    public string? BucketId { get; set; }

    public string? Name { get; set; }

    /// <summary>
    /// Field is deprecated, use owner_id instead
    /// </summary>
    public Guid? Owner { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? LastAccessedAt { get; set; }

    public string? Metadata { get; set; }

    public List<string>? PathTokens { get; set; }

    public string? Version { get; set; }

    public string? OwnerId { get; set; }

    public virtual Bucket? Bucket { get; set; }
}
