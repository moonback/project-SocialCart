import { supabase } from './supabase';

export class StoriesDebug {
  static async checkDatabaseSetup(): Promise<{
    tablesExist: boolean;
    bucketExists: boolean;
    policiesExist: boolean;
    errors: string[];
  }> {
    const result = {
      tablesExist: false,
      bucketExists: false,
      policiesExist: false,
      errors: [] as string[]
    };

    try {
      // Vérifier si les tables existent
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['product_stories', 'story_views', 'story_analytics']);

      if (tablesError) {
        result.errors.push(`Erreur vérification tables: ${tablesError.message}`);
      } else {
        result.tablesExist = tables?.length === 3;
        if (!result.tablesExist) {
          result.errors.push(`Tables manquantes. Trouvées: ${tables?.map(t => t.table_name).join(', ')}`);
        }
      }

      // Vérifier si le bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        result.errors.push(`Erreur vérification buckets: ${bucketsError.message}`);
      } else {
        result.bucketExists = buckets?.some(bucket => bucket.id === 'stories') || false;
        if (!result.bucketExists) {
          result.errors.push('Bucket "stories" manquant');
        }
      }

      // Vérifier les politiques RLS
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('tablename, policyname')
        .in('tablename', ['product_stories', 'story_views', 'story_analytics']);

      if (policiesError) {
        result.errors.push(`Erreur vérification politiques: ${policiesError.message}`);
      } else {
        result.policiesExist = (policies?.length || 0) > 0;
        if (!result.policiesExist) {
          result.errors.push('Politiques RLS manquantes');
        }
      }

    } catch (error) {
      result.errors.push(`Erreur générale: ${error}`);
    }

    return result;
  }

  static async createMissingTables(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Vérifier si les tables existent déjà
      const { data: existingTables, error: checkError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['product_stories', 'story_views', 'story_analytics']);

      if (checkError) {
        errors.push(`Erreur vérification tables: ${checkError.message}`);
        return { success: false, errors };
      }

      if (existingTables?.length === 3) {
        // Les tables existent déjà
        return { success: true, errors: [] };
      }

      // Les tables n'existent pas, on ne peut pas les créer via l'API REST
      errors.push('Les tables n\'existent pas. Veuillez exécuter le schéma SQL manuellement dans Supabase Dashboard > SQL Editor');
      errors.push('Fichier à exécuter: supabase/product_stories_schema.sql');

    } catch (error) {
      errors.push(`Erreur générale création tables: ${error}`);
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  static async createMissingBucket(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Créer le bucket stories
      const { data, error } = await supabase.storage.createBucket('stories', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (error) {
        if (error.message.includes('already exists')) {
          // Le bucket existe déjà, c'est OK
          return { success: true, errors: [] };
        }
        errors.push(`Erreur création bucket: ${error.message}`);
      }

    } catch (error) {
      errors.push(`Erreur générale création bucket: ${error}`);
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  static async setupRLSPolicies(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Vérifier si les politiques existent déjà
      const { data: existingPolicies, error: checkError } = await supabase
        .from('pg_policies')
        .select('tablename, policyname')
        .in('tablename', ['product_stories', 'story_views', 'story_analytics']);

      if (checkError) {
        errors.push(`Erreur vérification politiques: ${checkError.message}`);
        return { success: false, errors };
      }

      if ((existingPolicies?.length || 0) > 0) {
        // Les politiques existent déjà
        return { success: true, errors: [] };
      }

      // Les politiques n'existent pas, on ne peut pas les créer via l'API REST
      errors.push('Les politiques RLS n\'existent pas. Elles seront créées automatiquement avec le schéma SQL.');
      errors.push('Exécutez le fichier: supabase/product_stories_schema.sql');

    } catch (error) {
      errors.push(`Erreur générale création politiques: ${error}`);
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  static async createFunctions(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Vérifier si les fonctions existent déjà
      const { data: existingFunctions, error: checkError } = await supabase
        .from('pg_proc')
        .select('proname')
        .in('proname', ['increment_story_views', 'increment_story_interactions', 'increment_poll_vote', 'increment_quiz_answer']);

      if (checkError) {
        errors.push(`Erreur vérification fonctions: ${checkError.message}`);
        return { success: false, errors };
      }

      if ((existingFunctions?.length || 0) >= 4) {
        // Les fonctions existent déjà
        return { success: true, errors: [] };
      }

      // Les fonctions n'existent pas, on ne peut pas les créer via l'API REST
      errors.push('Les fonctions RPC n\'existent pas. Elles seront créées automatiquement avec le schéma SQL.');
      errors.push('Exécutez le fichier: supabase/product_stories_schema.sql');

    } catch (error) {
      errors.push(`Erreur générale création fonctions: ${error}`);
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  static async fullSetup(): Promise<{
    success: boolean;
    results: {
      tables: boolean;
      bucket: boolean;
      policies: boolean;
      functions: boolean;
    };
    errors: string[];
  }> {
    const errors: string[] = [];
    const results = {
      tables: false,
      bucket: false,
      policies: false,
      functions: false
    };

    try {
      // 1. Créer les tables
      const tablesResult = await this.createMissingTables();
      results.tables = tablesResult.success;
      errors.push(...tablesResult.errors);

      // 2. Créer le bucket
      const bucketResult = await this.createMissingBucket();
      results.bucket = bucketResult.success;
      errors.push(...bucketResult.errors);

      // 3. Créer les politiques RLS
      const policiesResult = await this.setupRLSPolicies();
      results.policies = policiesResult.success;
      errors.push(...policiesResult.errors);

      // 4. Créer les fonctions
      const functionsResult = await this.createFunctions();
      results.functions = functionsResult.success;
      errors.push(...functionsResult.errors);

    } catch (error) {
      errors.push(`Erreur générale setup: ${error}`);
    }

    return {
      success: errors.length === 0,
      results,
      errors
    };
  }
}
